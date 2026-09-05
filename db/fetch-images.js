'use strict';

/**
 * Seed photography fetcher.
 *
 * Pulls freely-licensed vehicle photographs from Wikimedia Commons, resizes
 * them and writes them into public/uploads/listings so the seeded catalogue
 * has real pictures rather than placeholders.
 *
 * Commons imagery is freely licensed but attribution terms vary by file. The
 * licence and author of every downloaded photo are recorded in
 * public/uploads/listings/CREDITS.json — review it before going to production,
 * and replace these with your own vehicle photography when you have it.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const config = require('../config');
const { LISTINGS } = require('./catalog');

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'AutoBlockAuctionsSeed/1.0 (vehicle auction platform seed script)';
const OUT = config.dirs.listings;
const PER_LISTING = 4;

/**
 * Search terms per catalogue photo key, ordered best-first.
 *
 * EXCLUDE keeps crash photography, police and military fleets, museum pieces
 * and scale models out of a catalogue that is meant to show clean, sellable
 * vehicles ready to go on the block.
 */
const EXCLUDE = '-crash -wreck -accident -burned -burnt -damaged -police -ambulance '
  + '-fire -military -army -museum -toy -diecast -miniature -scale';

const QUERIES = {
  'pickup truck': ['GMC Sierra 2500HD', 'GMC Sierra Denali', 'GMC Sierra 2020', 'GMC Sierra 2021'],
  'ram pickup truck': ['Ram 2500 pickup truck', 'Dodge Ram 2500', 'Ram heavy duty pickup'],
  'ford pickup truck': ['Ford F-150 pickup truck', 'Ford F150 2019', 'Ford F-Series pickup'],
  'tesla electric car': ['Tesla Model X', 'Tesla Model X 100D', 'Tesla Model X P100D'],
  'electric car charging': ['Hyundai Ioniq 5', 'Hyundai Ioniq 5 electric', 'electric car charging'],
  'toyota suv': ['Toyota 4Runner', 'Toyota 4Runner TRD', 'Toyota SUV 2022'],
  'jeep wrangler': ['Jeep Wrangler JL', 'Jeep Wrangler Rubicon 2020', 'Jeep Wrangler Unlimited JL', 'Jeep Wrangler 2019'],
  'honda sedan car': ['Honda Accord 2021', 'Honda Accord sedan', 'Honda Accord car'],
  'bmw coupe car': ['BMW 4 Series coupe', 'BMW M440i', 'BMW 4 Series G22'],
  'cargo van': ['Mercedes-Benz Sprinter van', 'Sprinter cargo van', 'Mercedes Sprinter 2500'],
  'harley davidson motorcycle': ['Harley-Davidson Road Glide', 'Harley-Davidson touring motorcycle', 'Harley-Davidson motorcycle'],
  'semi truck peterbilt': ['Peterbilt 389', 'Peterbilt 579', 'Peterbilt truck tractor'],
};

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  return res.json();
}

/** Search Commons for landscape photographs matching a term. */
async function search(term, limit = 12) {
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${term} ${EXCLUDE}`,
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1600',
  });

  const pages = (data.query && data.query.pages) || {};
  return Object.values(pages)
    .map((page) => {
      const info = page.imageinfo && page.imageinfo[0];
      if (!info) return null;
      const meta = info.extmetadata || {};
      return {
        title: page.title,
        url: info.thumburl || info.url,
        width: info.thumbwidth || info.width,
        height: info.thumbheight || info.height,
        licence: strip(meta.LicenseShortName && meta.LicenseShortName.value),
        author: strip(meta.Artist && meta.Artist.value),
        credit: page.title.replace(/^File:/, ''),
        descriptionUrl: info.descriptionurl,
      };
    })
    // Landscape only, and large enough to survive a 1600px resize.
    .filter((img) => img && img.url && img.width >= 900 && img.width > img.height);
}

/**
 * Rank candidates against the model year of the listing.
 *
 * Commons is full of well-photographed classics, and a search for "GMC Sierra"
 * happily returns a 1975 C/K for a 2021 Denali listing. Titles usually carry a
 * year, so scoring on that keeps a modern listing showing a modern vehicle.
 */
function rankCandidates(images, listing) {
  const targetYear = listing.year;
  const make = (listing.make || '').split(/[\s-]/)[0].toLowerCase();
  const model = (listing.model || '').split(/\s/)[0].toLowerCase();

  return images
    .map((img) => {
      const title = img.title;
      const lower = title.toLowerCase();
      let score = 0;

      // Relevance first. Commons full-text search happily returns a photo whose
      // *description* mentions the make; the filename is a far better signal.
      if (make && lower.includes(make)) score += 6;
      if (model && model.length > 2 && lower.includes(model)) score += 4;
      if (make && !lower.includes(make)) score -= 10;   // almost certainly wrong

      // Strip YYYYMMDD-style filename prefixes before reading model years,
      // otherwise "20200705_..." reads as a 2020 vehicle.
      const cleaned = title.replace(/\b(19|20)\d{6}\b/g, ' ');
      const years = (cleaned.match(/\b(19|20)\d{2}\b/g) || []).map(Number)
        .filter((y) => y >= 1950 && y <= new Date().getFullYear() + 1);

      if (targetYear && years.length) {
        const closest = years.reduce(
          (best, y) => (Math.abs(y - targetYear) < Math.abs(best - targetYear) ? y : best)
        );
        const gap = Math.abs(closest - targetYear);
        if (gap <= 2) score += 4;
        else if (gap <= 5) score += 1;
        else score -= 5;              // a different generation entirely
      }

      // "Classic" almost always means a previous generation.
      if (/\bclassic\b|\bvintage\b|\boldtimer\b|\bhistoric\b|\bmuseum\b/i.test(title)) score -= 6;
      // Detail shots make poor catalogue photography.
      if (/\binterior\b|\bengine bay\b|\bdashboard\b|\bwheel\b|\bbadge\b|\blogo\b/i.test(title)) score -= 4;

      return { ...img, score };
    })
    .sort((a, b) => b.score - a.score);
}

function strip(html) {
  if (!html) return null;
  return String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);
}

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const credits = [];
  const seen = new Set();
  let total = 0;

  for (const listing of LISTINGS) {
    const terms = QUERIES[listing.photo] || [listing.photo];

    // Gather across every term first, then rank once, so a good match from the
    // third query still beats a poor one from the first.
    const pool = [];
    for (const term of terms) {
      let results = [];
      try {
        results = await search(term);
      } catch (err) {
        console.warn(`  ! search failed for "${term}": ${err.message}`);
        continue;
      }
      for (const img of results) {
        if (seen.has(img.title)) continue;      // no duplicate photo across lots
        if (pool.some((p) => p.title === img.title)) continue;
        pool.push(img);
      }
    }

    const chosen = rankCandidates(pool, listing).slice(0, PER_LISTING);
    chosen.forEach((img) => seen.add(img.title));

    if (!chosen.length) {
      console.warn(`  ! no photos found for ${listing.slug}`);
      continue;
    }

    console.log(`${listing.slug} — ${chosen.length} photo(s)`);

    for (const [i, img] of chosen.entries()) {
      const fileName = `${listing.slug}-${i + 1}.jpg`;
      const outPath = path.join(OUT, fileName);

      if (fs.existsSync(outPath)) {
        console.log(`  · ${fileName} (already present)`);
        credits.push({ file: fileName, ...creditFor(img) });
        total += 1;
        continue;
      }

      try {
        const buffer = await download(img.url);
        await sharp(buffer)
          .rotate()
          .resize(1600, 1200, { fit: 'cover', position: 'centre' })
          .jpeg({ quality: 84, progressive: true, mozjpeg: true })
          .toFile(outPath);

        credits.push({ file: fileName, ...creditFor(img) });
        total += 1;
        console.log(`  ✓ ${fileName}`);
      } catch (err) {
        console.warn(`  ! failed ${fileName}: ${err.message}`);
      }

      // Be a considerate API client.
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
  }

  fs.writeFileSync(
    path.join(OUT, 'CREDITS.json'),
    JSON.stringify({
      note:
        'Seed photography sourced from Wikimedia Commons. Licences vary per file — ' +
        'review each entry and comply with its attribution terms, or replace these ' +
        'images with your own photography before going to production.',
      generatedAt: new Date().toISOString(),
      images: credits,
    }, null, 2)
  );

  console.log(`\n[images] ${total} photo(s) ready in ${OUT}`);
  console.log('[images] attribution recorded in CREDITS.json');
}

function creditFor(img) {
  return {
    source: 'Wikimedia Commons',
    title: img.credit,
    author: img.author || 'Unknown',
    licence: img.licence || 'See description page',
    descriptionUrl: img.descriptionUrl,
  };
}

main().catch((err) => {
  console.error('[images] failed:', err);
  process.exitCode = 1;
});
