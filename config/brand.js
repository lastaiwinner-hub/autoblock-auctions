'use strict';

/**
 * ============================================================================
 *  BRAND CONFIGURATION  —  EDIT THIS FILE TO REBRAND THE ENTIRE PLATFORM
 * ============================================================================
 *  Every user-visible name, address, phone number, legal entity string and
 *  colour token flows from this one file: the website, the transactional
 *  emails and the generated Purchase Agreement PDFs all read from here.
 *  Change a value once and it propagates everywhere.
 * ==========================================================================*/

module.exports = {
  // ---- Identity -----------------------------------------------------------
  name: 'AutoBlock Auctions',
  legalName: 'AutoBlock Auctions LLC',
  shortName: 'AutoBlock',
  tagline: 'Bid. Buy. Drive.',
  domain: 'autoblock-auctions.com',
  vertical: 'automotive', // 'equipment' | 'automotive' — drives spec fields & copy

  description:
    'Online car auctions and instant-buy pricing on trucks, SUVs, sedans and ' +
    'motorcycles. Every vehicle inspected, every bidder identity-verified, ' +
    'digital purchase agreements and door-to-door delivery nationwide.',

  // ---- Contact ------------------------------------------------------------
  contact: {
    email: 'sales@autoblock-auctions.com',
    supportEmail: 'support@autoblock-auctions.com',
    noreplyEmail: 'no-reply@autoblock-auctions.com',
    phone: '+1 (360) 555-0178',
    phoneHref: '+13605550178',
    hours: 'Mon–Fri  7:00 AM – 8:00 PM PT',
    hoursShort: 'Mon–Fri 7AM–8PM',
    responseTime: 'We reply within 24 hours',
  },

  // ---- Registered address (also the Seller block on every agreement) ------
  address: {
    line1: '2260 Cascade Auto Center Drive',
    line2: '',
    city: 'Castle Rock',
    state: 'WA',
    stateFull: 'Washington',
    postalCode: '98611',
    country: 'United States',
    get oneLine() {
      return `${this.line1}, ${this.city}, ${this.state} ${this.postalCode}`;
    },
  },

  // ---- Signing officer printed on the seller line of the agreement --------
  signatory: {
    name: 'Priya Raghunathan',
    title: 'Managing Member',
  },

  // ---- Commercial terms (rendered into contracts and FAQ) -----------------
  terms: {
    inspectionDays: 30,          // buy-back / inspection window, in days
    warrantyMonths: 6,           // post-sale warranty
    returnNoticeDays: 5,         // days to notify of intent to return
    maxInspectionHours: 0,       // not meaningful for road vehicles
    maxInspectionMiles: 250,     // road miles allowed during inspection
    refundWindowHours: 48,       // refund turnaround after return accepted
    deliveryRatePerMile: 0.85,   // USD per mile, delivery estimator
    defaultShippingFee: 895_00,  // cents — fallback when no ZIP is supplied
    depositPercent: 0,           // 0 = no deposit required to bid
    buyerPremiumPercent: 0,      // 0 = no buyer's premium ("no hidden fees")
    currency: 'USD',
    currencySymbol: '$',
    paymentMethods: 'bank wire transfer',
    deliveryWindow: '2–7 business days',
    deliveryRegion: 'the United States, Canada and Mexico',
  },

  // ---- Auction mechanics --------------------------------------------------
  auction: {
    defaultIncrement: 100_00,      // cents — minimum raise between bids
    antiSnipeWindowMin: 2,         // a bid inside this window extends the lot
    antiSnipeExtendMin: 2,         // ...by this many minutes
    defaultDurationHours: 72,      // length of a fresh auction cycle
    relistOnClose: true,           // keep selling after a winner is declared
    relistDelayMinutes: 15,        // pause between cycles
    proxyBidding: true,            // allow maximum (autobid) amounts
  },

  // ---- Visual identity ----------------------------------------------------
  // Editorial showroom: a warm bone canvas, an electric blue-to-violet accent,
  // a display serif for headlines and generous air. Deliberately the opposite
  // of the sister equipment brand, which is white, hard-edged and amber.
  theme: {
    // The Board: a near-white sheet, a black masthead, and one signal red that
    // only ever means "this is live" or "this is about to close".
    accent: '#101014',        // ink — primary actions, the masthead
    accentDeep: '#2B2B33',
    accentSoft: '#F1F0EC',
    accentInk: '#101014',
    hot: '#E5342A',           // signal red — live and closing only
    ink: '#101014',
    inkSoft: '#3A3A42',
    surface: '#FFFFFF',
    surfaceAlt: '#FBFBF9',    // the board itself
    muted: '#6A6A72',
    line: '#E6E5E0',
    live: '#E5342A',
    success: '#0E8A5F',
    danger: '#D93B33',
    info: '#101014',
    warn: '#B4780A',
    displayFont: "'Archivo', system-ui, sans-serif",
    bodyFont: "'Archivo', system-ui, sans-serif",
    monoFont: "'IBM Plex Mono', ui-monospace, monospace",
    googleFonts:
      'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&' +
      'family=IBM+Plex+Mono:wght@400;500;600&display=swap',
  },

  // ---- Social -------------------------------------------------------------
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  },

  // ---- Trust badges shown on listing pages --------------------------------
  trustBadges: [
    { icon: 'shield-check', label: 'Verified Listing' },
    { icon: 'lock',         label: 'Secure Payment' },
    { icon: 'signature',    label: 'Digital Agreement' },
    { icon: 'headset',      label: 'Mon–Fri Support' },
    { icon: 'rotate-left',  label: '30-Day Returns' },
    { icon: 'certificate',  label: '6-Month Warranty' },
    { icon: 'clipboard',    label: 'Title & Docs Included' },
  ],
};
