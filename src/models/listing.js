'use strict';

const { db } = require('../../config/database');
const { nowIso } = require('../services/dates');

const LIST_SELECT = `
  SELECT l.*,
         c.name AS category_name,
         c.slug AS category_slug,
         (SELECT file_name FROM listing_images i
           WHERE i.listing_id = l.id
           ORDER BY i.is_primary DESC, i.sort_order ASC LIMIT 1) AS primary_image
    FROM listings l
    LEFT JOIN categories c ON c.id = l.category_id
`;

/** JSON columns are stored as text; decode them once at the boundary. */
function hydrate(row) {
  if (!row) return null;
  return {
    ...row,
    highlights: safeJson(row.highlights, []),
    specs: safeJson(row.specs, []),
  };
}

function safeJson(value, fallback) {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function findById(id) {
  return hydrate(db.prepare(`${LIST_SELECT} WHERE l.id = ?`).get(id));
}

function findBySlug(slug) {
  return hydrate(db.prepare(`${LIST_SELECT} WHERE l.slug = ?`).get(slug));
}

function images(listingId) {
  return db.prepare(`
    SELECT * FROM listing_images WHERE listing_id = ?
     ORDER BY is_primary DESC, sort_order ASC, id ASC
  `).all(listingId);
}

/**
 * The public catalogue query. Every filter is optional and composes with the
 * others; `sort` is whitelisted because it interpolates into the SQL.
 */
const SORTS = {
  ending_soon: 'l.auction_ends_at ASC',
  mileage_low: 'l.mileage ASC',
  newest: 'l.created_at DESC',
  price_low: 'l.buy_now_price ASC',
  price_high: 'l.buy_now_price DESC',
  most_bids: 'l.bid_count DESC',
  year_new: 'l.year DESC',
};

function search({
  q, category, make, model, yearMin, yearMax, priceMin, priceMax,
  mileageMax, fuelType, transmission, titleStatus,
  condition, onlyAuctions, onlyFeatured, status = 'live',
  sort = 'ending_soon', limit = 12, offset = 0,
} = {}) {
  const where = [];
  const params = {};

  if (status) { where.push('l.status = @status'); params.status = status; }
  if (q) {
    where.push(`(l.title LIKE @q OR l.make LIKE @q OR l.model LIKE @q
                 OR l.trim LIKE @q OR l.stock_number LIKE @q OR l.vin LIKE @q
                 OR l.description LIKE @q OR CAST(l.year AS TEXT) LIKE @q)`);
    params.q = `%${q}%`;
  }
  if (category) { where.push('c.slug = @category'); params.category = category; }
  if (make) { where.push('l.make = @make'); params.make = make; }
  if (model) { where.push('l.model = @model'); params.model = model; }
  if (yearMin) { where.push('l.year >= @yearMin'); params.yearMin = Number(yearMin); }
  if (yearMax) { where.push('l.year <= @yearMax'); params.yearMax = Number(yearMax); }
  if (priceMin) { where.push('l.buy_now_price >= @priceMin'); params.priceMin = Number(priceMin); }
  if (priceMax) { where.push('l.buy_now_price <= @priceMax'); params.priceMax = Number(priceMax); }
  if (mileageMax) { where.push('l.mileage <= @mileageMax'); params.mileageMax = Number(mileageMax); }
  if (fuelType) { where.push('l.fuel_type = @fuelType'); params.fuelType = fuelType; }
  if (transmission) { where.push('l.transmission = @transmission'); params.transmission = transmission; }
  if (titleStatus) { where.push('l.title_status = @titleStatus'); params.titleStatus = titleStatus; }
  if (condition) { where.push('l.condition = @condition'); params.condition = condition; }
  if (onlyAuctions) { where.push("l.auction_ends_at IS NOT NULL AND l.status = 'live'"); }
  if (onlyFeatured) { where.push('l.is_featured = 1'); }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const order = SORTS[sort] || SORTS.ending_soon;

  const rows = db.prepare(`
    ${LIST_SELECT} ${clause} ORDER BY ${order} LIMIT @limit OFFSET @offset
  `).all({ ...params, limit, offset });

  const { total } = db.prepare(`
    SELECT COUNT(*) AS total FROM listings l
      LEFT JOIN categories c ON c.id = l.category_id ${clause}
  `).get(params);

  return { rows: rows.map(hydrate), total };
}

/** Distinct values powering the filter dropdowns, restricted to live stock. */
function facets() {
  const makes = db.prepare(`
    SELECT make, COUNT(*) AS n FROM listings
     WHERE status = 'live' AND make IS NOT NULL GROUP BY make ORDER BY make
  `).all();
  const models = db.prepare(`
    SELECT make, model, COUNT(*) AS n FROM listings
     WHERE status = 'live' AND model IS NOT NULL GROUP BY make, model ORDER BY model
  `).all();
  const years = db.prepare(`
    SELECT DISTINCT year FROM listings
     WHERE status = 'live' AND year IS NOT NULL ORDER BY year DESC
  `).all().map((r) => r.year);
  const priceRange = db.prepare(`
    SELECT MIN(buy_now_price) AS min, MAX(buy_now_price) AS max
      FROM listings WHERE status = 'live'
  `).get();
  const fuels = db.prepare(`
    SELECT fuel_type, COUNT(*) AS n FROM listings
     WHERE status = 'live' AND fuel_type IS NOT NULL
     GROUP BY fuel_type ORDER BY n DESC
  `).all();
  const transmissions = db.prepare(`
    SELECT transmission, COUNT(*) AS n FROM listings
     WHERE status = 'live' AND transmission IS NOT NULL
     GROUP BY transmission ORDER BY n DESC
  `).all();
  const titles = db.prepare(`
    SELECT title_status, COUNT(*) AS n FROM listings
     WHERE status = 'live' AND title_status IS NOT NULL
     GROUP BY title_status ORDER BY n DESC
  `).all();
  return { makes, models, years, priceRange, fuels, transmissions, titles };
}

function categoriesWithCounts() {
  return db.prepare(`
    SELECT c.*, COUNT(l.id) AS listing_count
      FROM categories c
      LEFT JOIN listings l ON l.category_id = c.id AND l.status = 'live'
     GROUP BY c.id ORDER BY c.sort_order, c.name
  `).all();
}

function featured(limit = 8) {
  return search({ onlyFeatured: true, sort: 'ending_soon', limit }).rows;
}

function endingSoon(limit = 12) {
  return db.prepare(`
    ${LIST_SELECT}
     WHERE l.status = 'live' AND l.auction_ends_at > @now
     ORDER BY l.auction_ends_at ASC LIMIT @limit
  `).all({ now: nowIso(), limit }).map(hydrate);
}

function related(listing, limit = 3) {
  const matches = db.prepare(`
    ${LIST_SELECT}
     WHERE l.status = 'live' AND l.id != @id
       AND (l.category_id = @categoryId OR l.make = @make)
     ORDER BY (l.category_id = @categoryId) DESC, l.auction_ends_at ASC
     LIMIT @limit
  `).all({
    id: listing.id, categoryId: listing.category_id, make: listing.make, limit,
  }).map(hydrate);

  if (matches.length >= limit) return matches;

  // A one-off still deserves a row of alternatives, so top up with whatever
  // else is closing soonest rather than showing an empty shelf.
  const seen = new Set([listing.id, ...matches.map((r) => r.id)]);
  const fillers = db.prepare(`
    ${LIST_SELECT}
     WHERE l.status = 'live' ORDER BY l.auction_ends_at ASC LIMIT @limit
  `).all({ limit: limit + seen.size }).map(hydrate);

  for (const row of fillers) {
    if (matches.length >= limit) break;
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    matches.push(row);
  }
  return matches;
}

function incrementViews(id) {
  db.prepare('UPDATE listings SET view_count = view_count + 1 WHERE id = ?').run(id);
}

function liveCount() {
  return db.prepare("SELECT COUNT(*) AS n FROM listings WHERE status = 'live'").get().n;
}

function activeAuctionCount() {
  return db.prepare(`
    SELECT COUNT(*) AS n FROM listings
     WHERE status = 'live' AND auction_ends_at > ?
  `).get(nowIso()).n;
}

// ---- Writes (admin) -------------------------------------------------------

const WRITABLE = [
  'slug', 'title', 'category_id', 'year', 'make', 'model', 'condition',
  'mileage', 'vin', 'engine_hp', 'engine_type', 'transmission', 'drivetrain',
  'fuel_type', 'body_style', 'exterior_color', 'interior_color', 'doors',
  'seats', 'trim', 'title_status', 'stock_number',
  'description', 'highlights', 'specs',
  'location_city', 'location_state', 'location_zip',
  'buy_now_price', 'starting_bid', 'reserve_price', 'bid_increment',
  'auction_starts_at', 'auction_ends_at', 'status', 'quantity',
  'keep_selling', 'is_featured',
];

function create(data) {
  const payload = pick(data);
  const cols = Object.keys(payload);
  const info = db.prepare(`
    INSERT INTO listings (${cols.join(', ')}, current_bid)
    VALUES (${cols.map((c) => `@${c}`).join(', ')}, @current_bid)
  `).run({ ...payload, current_bid: 0 });
  return Number(info.lastInsertRowid);
}

function update(id, data) {
  const payload = pick(data);
  const cols = Object.keys(payload);
  if (!cols.length) return findById(id);
  db.prepare(`
    UPDATE listings SET ${cols.map((c) => `${c} = @${c}`).join(', ')}, updated_at = @now
     WHERE id = @id
  `).run({ ...payload, id, now: nowIso() });
  return findById(id);
}

function pick(data) {
  const out = {};
  for (const key of WRITABLE) {
    if (data[key] === undefined) continue;
    out[key] = ['highlights', 'specs'].includes(key) && typeof data[key] !== 'string'
      ? JSON.stringify(data[key])
      : data[key];
  }
  return out;
}

function remove(id) {
  db.prepare('DELETE FROM listings WHERE id = ?').run(id);
}

function addImage(listingId, { fileName, alt, sortOrder = 0, isPrimary = 0 }) {
  db.prepare(`
    INSERT INTO listing_images (listing_id, file_name, alt, sort_order, is_primary)
    VALUES (?, ?, ?, ?, ?)
  `).run(listingId, fileName, alt || null, sortOrder, isPrimary ? 1 : 0);
}

function removeImage(imageId) {
  db.prepare('DELETE FROM listing_images WHERE id = ?').run(imageId);
}

/** Human-readable odometer figure, as printed on the purchase agreement. */
function meterLabel(listing) {
  if (listing.mileage === null || listing.mileage === undefined) return 'On request';
  return `${Number(listing.mileage).toLocaleString('en-US')} Miles`;
}

module.exports = {
  findById, findBySlug, images, search, facets, categoriesWithCounts,
  featured, endingSoon, related, incrementViews, liveCount, activeAuctionCount,
  create, update, remove, addImage, removeImage, hydrate, meterLabel, SORTS,
};
