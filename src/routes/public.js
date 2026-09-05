'use strict';

const express = require('express');
const config = require('../../config');
const { db } = require('../../config/database');
const listingModel = require('../models/listing');
const mailer = require('../services/mailer');
const { templates } = require('../services/emailTemplates');
const { validate } = require('../middleware/validate');
const { limiters, asyncRoute } = require('../middleware/common');

const router = express.Router();
const B = config.brand;

router.get('/', (req, res) => {
  const endingSoon = listingModel.endingSoon(9);
  const featured = listingModel.featured(6);

  res.render('pages/home', {
    title: `${B.name} — ${B.tagline}`,
    metaDescription: B.description,
    bodyClass: 'page-home',
    endingSoon,
    featured: featured.length ? featured : endingSoon.slice(0, 6),
    facets: listingModel.facets(),
    reviews: REVIEWS.slice(0, 3),
    // The six questions a first-time bidder asks before they will place a bid.
    homeFaq: FAQ.flatMap((g) => g.items).slice(0, 6),
    stats: {
      live: listingModel.liveCount(),
      auctions: listingModel.activeAuctionCount(),
      categories: listingModel.categoriesWithCounts().filter((c) => c.listing_count > 0).length,
    },
  });
});

// ---------------------------------------------------------------------------
// Stock alerts — the one-field sign-up on the home page. Stored in the same
// inbox as a contact enquiry so the team works from a single list.
// ---------------------------------------------------------------------------
router.post('/alerts', limiters.contact, asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().slice(0, 190);
  const wanted = String(req.body.wanted || '').trim().slice(0, 500);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    req.flash('error', 'Please enter a valid email address.');
    return res.redirect('/#alerts');
  }

  db.prepare(`
    INSERT INTO contact_messages (name, email, phone, subject, message, ip_address)
    VALUES (?, ?, NULL, ?, ?, ?)
  `).run('Alert subscriber', email, 'vehicle alert request',
    wanted || 'Please email me when matching vehicle is catalogued.', req.ip);

  const alert = templates.adminAlert({
    title: 'New vehicle alert subscriber',
    lines: [['Email', email], ['Looking for', wanted || 'Anything new']],
    url: `${config.baseUrl}/admin/messages`,
    label: 'Open inbox',
  });
  await mailer.send({
    to: config.mail.adminNotify, subject: alert.subject,
    html: alert.html, template: alert.template,
  });

  req.flash('success', 'You are on the list — we will email you when something matching lands.');
  return res.redirect('/');
}));

router.get('/how-it-works', (req, res) => {
  res.render('pages/how-it-works', {
    title: `How it works — ${B.name}`,
    metaDescription:
      `Register, verify your ID, bid or buy instantly, sign your purchase agreement ` +
      `and take delivery anywhere in ${B.terms.deliveryRegion}.`,
    steps: STEPS,
  });
});

router.get('/faq', (req, res) => {
  res.render('pages/faq', {
    title: `Frequently asked questions — ${B.name}`,
    metaDescription: `Answers on bidding, identity verification, payment, the ${B.terms.inspectionDays}-day inspection period, delivery and returns.`,
    groups: FAQ,
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: `About ${B.name}`,
    metaDescription: `${B.legalName} is a vehicle auction house based in ${B.address.city}, ${B.address.stateFull}.`,
    values: VALUES,
    reviews: REVIEWS,
  });
});

router.get('/reviews', (req, res) => {
  res.render('pages/reviews', {
    title: `Buyer reviews — ${B.name}`,
    metaDescription: 'Verified reviews from vehicle buyers across the United States.',
    reviews: REVIEWS,
    average: (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1),
  });
});

router.get('/terms-of-service', (req, res) => {
  res.render('pages/legal', {
    title: `Terms of service — ${B.name}`,
    heading: 'Terms of Service',
    updated: 'September 1, 2026',
    sections: require('../content/terms')(B),
  });
});

router.get('/privacy-policy', (req, res) => {
  res.render('pages/legal', {
    title: `Privacy policy — ${B.name}`,
    heading: 'Privacy Policy',
    updated: 'September 1, 2026',
    sections: require('../content/privacy')(B),
  });
});

// ---- Contact --------------------------------------------------------------

router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: `Contact ${B.name}`,
    metaDescription: `Call ${B.contact.phone} or send a message — we reply within one business day.`,
    values: {},
    errors: {},
  });
});

router.post('/contact', limiters.contact, asyncRoute(async (req, res) => {
  const { values, errors, valid } = validate(req.body, {
    name: { required: true, label: 'Name', maxLength: 120 },
    email: { required: true, type: 'email', label: 'Email' },
    phone: { type: 'phone', label: 'Phone' },
    subject: { maxLength: 160, default: 'General enquiry' },
    message: { required: true, minLength: 10, maxLength: 4000, label: 'Message' },
    website: {},   // honeypot, see below
  });

  // Bots fill every field they find; a real visitor never sees this one.
  if (values.website) {
    return res.redirect('/contact?sent=1');
  }

  if (!valid) {
    return res.status(400).render('pages/contact', {
      title: `Contact ${B.name}`, values, errors,
    });
  }

  db.prepare(`
    INSERT INTO contact_messages (name, email, phone, subject, message, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(values.name, values.email, values.phone || null,
    values.subject, values.message, req.ip);

  const receipt = templates.contactReceipt({ name: values.name });
  await mailer.send({
    to: values.email,
    subject: receipt.subject,
    html: receipt.html,
    template: receipt.template,
  });

  const alert = templates.adminAlert({
    title: `New enquiry from ${values.name}`,
    lines: [
      ['Name', values.name],
      ['Email', values.email],
      ['Phone', values.phone || '—'],
      ['Subject', values.subject],
      ['Message', values.message.slice(0, 500)],
    ],
    url: `${config.baseUrl}/admin/messages`,
    label: 'Open inbox',
  });
  await mailer.send({
    to: config.mail.adminNotify,
    subject: alert.subject,
    html: alert.html,
    template: alert.template,
    replyTo: values.email,
  });

  req.flash('success', 'Thanks — your message is with our team. We reply within one business day.');
  return res.redirect('/contact?sent=1');
}));

// ---- Machine-readable -----------------------------------------------------

router.get('/sitemap.xml', (req, res) => {
  const listings = db.prepare(
    "SELECT slug, updated_at FROM listings WHERE status = 'live'"
  ).all();
  const staticPaths = ['', '/inventory', '/how-it-works', '/faq', '/about',
    '/reviews', '/contact', '/terms-of-service', '/privacy-policy'];

  const urls = [
    ...staticPaths.map((p) => `<url><loc>${config.baseUrl}${p}</loc><changefreq>daily</changefreq></url>`),
    ...listings.map((l) =>
      `<url><loc>${config.baseUrl}/lot/${l.slug}</loc><lastmod>${l.updated_at.slice(0, 10)}</lastmod><changefreq>hourly</changefreq></url>`),
  ].join('\n  ');

  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls}\n</urlset>`
  );
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /account\nDisallow: /sign\nDisallow: /api\n\nSitemap: ${config.baseUrl}/sitemap.xml\n`
  );
});

router.get('/healthz', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ ok: true, uptime: process.uptime(), env: config.env });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// Static page content
// ---------------------------------------------------------------------------

const STEPS = [
  {
    n: '01',
    title: 'Create your account',
    body: 'Register in under a minute — no card, no cost. You can browse every listing and build a watchlist straight away.',
    detail: 'All you need is a name, an email address and a phone number. Confirm your email and your account is open.',
  },
  {
    n: '02',
    title: 'Verify your identity',
    body: 'Upload the front and back of a government-issued ID plus a quick selfie. Verification is what keeps fake accounts and time-wasters out of the bidding.',
    detail: 'Our team reviews documents during business hours — usually within a few hours. You are emailed the moment you are cleared.',
  },
  {
    n: '03',
    title: 'Bid or buy it now',
    body: 'Place a bid on any live auction, or skip it and take the vehicle at its Buy Now price. Set a maximum and we bid for you, one increment at a time.',
    detail: 'A bid inside the final two minutes extends the auction by two minutes, so nothing is ever sniped in the last second.',
  },
  {
    n: '04',
    title: 'Sign your purchase agreement',
    body: 'Your agreement is generated automatically with your name, address and the vehicle details already filled in. Review it and sign electronically — no printer, no scanner.',
    detail: 'Signed electronically under the U.S. ESIGN Act. You receive a fully executed PDF with a signature certificate.',
  },
  {
    n: '05',
    title: 'Pay securely',
    body: 'We issue your invoice with bank wire instructions quoting your order number. Funds are verified before anything moves.',
    detail: 'We never store card details, and we will never email you a change of bank details.',
  },
  {
    n: '06',
    title: 'Take delivery',
    body: 'We arrange enclosed or open transport to your door, send you tracking, and hand over the title. Your inspection period starts the next weekday morning.',
    detail: `Most deliveries land within ${B.terms.deliveryWindow} across ${B.terms.deliveryRegion}.`,
  },
];

const VALUES = [
  {
    title: 'Every vehicle inspected',
    body: 'Nothing goes on the block until it has been through our shop, been serviced and been photographed properly — mileage, wear, faults and all.',
  },
  {
    title: 'Verified bidders only',
    body: 'Identity verification is mandatory before a bid is accepted. It keeps the bidding honest and the auction clean for serious buyers.',
  },
  {
    title: 'Straight pricing',
    body: 'No buyer premium, no doc fee, no surprise line item at the end. The number you bid is the number on the agreement.',
  },
  {
    title: 'Title in the box',
    body: 'Every vehicle comes with its title or ownership document, and the title status — clean, rebuilt or salvage — is disclosed before you bid.',
  },
  {
    title: `${B.terms.inspectionDays}-day money back`,
    body: `Take delivery, put your own mechanic on it, and if the vehicle is not as described we collect it and refund you in full within ${B.terms.refundWindowHours} hours.`,
  },
  {
    title: 'Real people on the phone',
    body: `Call ${B.contact.phone} during ${B.contact.hoursShort} and you get someone who has actually walked around the car, not a script.`,
  },
];

const FAQ = [
  {
    group: 'Bidding & buying',
    items: [
      {
        q: 'How do the auctions work?',
        a: `Each vehicle runs as a timed online auction. The listing shows the current bid, the minimum next bid and the time remaining. The highest verified bidder when the clock runs out wins. A bid placed in the final ${B.auction.antiSnipeWindowMin} minutes extends the auction by ${B.auction.antiSnipeExtendMin} minutes, so a car can never be sniped in the closing seconds.`,
      },
      {
        q: 'What is a maximum bid?',
        a: 'Instead of watching the clock, you can leave a maximum. We bid on your behalf in single increments, only as high as needed to keep you in front, and never above your ceiling. If someone outbids your maximum you are emailed immediately.',
      },
      {
        q: 'Is there a Buy It Now option?',
        a: 'Yes. Every vehicle carries a Buy Now price alongside its auction. If you would rather not bid, take it at that price and we move straight to the agreement.',
      },
      {
        q: 'If someone wins the auction, is the vehicle gone?',
        a: 'Not necessarily. We hold real stock and frequently have more than one of the same model and trim. When a cycle closes we declare the winner and, where stock allows, immediately open a fresh auction cycle on the same listing — so you can keep bidding, or take it at the Buy Now price right away.',
      },
      {
        q: 'Is there a buyer premium or doc fee?',
        a: `No. There is no buyer premium and no documentation fee. You pay the hammer price or Buy Now price, plus delivery, plus any tax, title and registration that applies in your state. Delivery is estimated at ${B.terms.currencySymbol}${B.terms.deliveryRatePerMile.toFixed(2)} per mile from our lot and confirmed in writing before you pay.`,
      },
      {
        q: 'Can I inspect the vehicle before bidding?',
        a: `Most of our auctions are online-only, so a physical pre-bid inspection is not usually available — that is exactly why every purchase carries a ${B.terms.inspectionDays}-day money-back guarantee. Call ${B.contact.phone} and we will send additional photos, a walk-around video or the vehicle history report before you bid.`,
      },
    ],
  },
  {
    group: 'Account & verification',
    items: [
      {
        q: 'Why do I need to upload my ID?',
        a: 'A bid is a binding commitment, so we verify who is making it. Every buyer must upload the front and back of a government-issued ID and a selfie before their first bid or purchase. It keeps fake accounts and time-wasters out of the auction, and it is what lets us title a vehicle into the right name afterwards.',
      },
      {
        q: 'How long does verification take?',
        a: 'Documents are reviewed by our team during business hours, usually within a few hours. You are emailed as soon as your account is cleared.',
      },
      {
        q: 'How are my documents stored?',
        a: 'Identity documents are stored outside the public web root, are never linked publicly, and are only accessible to the verification team. Location data is stripped from every uploaded image on receipt.',
      },
      {
        q: 'Does it cost anything to register?',
        a: 'No. Registration is free, takes under a minute and needs no payment details. You only ever pay for a vehicle you have bid on and won, or bought outright.',
      },
    ],
  },
  {
    group: 'Agreements & payment',
    items: [
      {
        q: 'When do I get the purchase agreement?',
        a: 'As soon as you place a bid. The agreement is generated automatically with your name, address, the vehicle details, the VIN and your bid amount already filled in, and emailed to you for electronic signature. Signing early means that if you win, delivery is arranged the same day with no further paperwork.',
      },
      {
        q: 'Does signing commit me to pay if I do not win?',
        a: 'No. The agreement only takes effect on the vehicle you actually win, or on a Buy Now purchase you complete. If you are outbid, nothing is owed.',
      },
      {
        q: 'Is an electronic signature legally binding?',
        a: 'Yes. Signatures are captured under the U.S. ESIGN Act and applicable state UETA legislation, with a full audit trail of when the document was sent, viewed and signed, and from which IP address. Both parties receive the executed PDF with a signature certificate attached.',
      },
      {
        q: 'How do I pay?',
        a: `Payment is by ${B.terms.paymentMethods}. Once your agreement is signed we issue an invoice with our bank details and your order number as the reference. We never store card data, and we will never email you a change of banking details — if you receive such a message, call ${B.contact.phone} before sending funds.`,
      },
    ],
  },
  {
    group: 'Title, delivery & returns',
    items: [
      {
        q: 'Is the title included?',
        a: 'Yes. Every vehicle is sold with its title or equivalent ownership document, and the title status — clean, rebuilt or salvage — is disclosed on the listing before you bid and repeated on your purchase agreement. Titles are released once payment clears, and are sent by tracked mail or handed over on delivery.',
      },
      {
        q: 'Who handles registration and tax?',
        a: 'Titling, registration, road tax and any state inspection or emissions certificate are the buyer\'s responsibility and at the buyer\'s cost. We provide every document you need to complete it at your DMV.',
      },
      {
        q: 'How does delivery work?',
        a: `Once payment clears we assign a vetted transporter and send you tracking. Most deliveries land within ${B.terms.deliveryWindow} across ${B.terms.deliveryRegion}. If your street cannot take a full-size carrier we will arrange a nearby meeting point.`,
      },
      {
        q: 'Can I collect from your lot instead?',
        a: 'Customer collection is not available. Every vehicle is delivered through our authorised transport partners so that condition on arrival is documented and the inspection period has a clear start date.',
      },
      {
        q: `What does the ${B.terms.inspectionDays}-day money-back guarantee cover?`,
        a: `Your inspection window opens at 9:00 AM on the weekday after delivery. Take it to your own mechanic. If it is not as described, notify us in writing within ${B.terms.returnNoticeDays} days of receiving it and no later than ${B.terms.inspectionDays} days after the sale date, and we collect it at our cost and refund you in full within ${B.terms.refundWindowHours} hours.`,
      },
      {
        q: 'What are the limits during the inspection period?',
        a: `The vehicle must not be altered, repaired, resold or used commercially. Driving is limited to what is needed to verify condition — no more than ${B.terms.maxInspectionMiles} miles beyond the odometer reading at time of sale.`,
      },
      {
        q: 'Is there a warranty after the inspection period?',
        a: `Yes. Every vehicle carries a ${B.terms.warrantyMonths}-month warranty. It does not cover physical damage occurring after the inspection process, wear items, or damage caused by misuse, neglect or unauthorised modification.`,
      },
    ],
  },
];

const REVIEWS = [
  {
    name: 'Derek Simmons', photo: '/img/avatars/m01.jpg', location: 'Albany, GA', rating: 5,
    item: '2021 GMC Sierra 2500HD Denali',
    body: 'I have bought from three different dealers in the last five years and this was by far the best experience. Price was fair, the photos were honest, and the truck was detailed and full of fuel when it arrived.',
  },
  {
    name: 'Cynthia Rowe', photo: '/img/avatars/w01.jpg', location: 'Pensacola, FL', rating: 5,
    item: '2020 Tesla Model X Long Range Plus',
    body: 'The battery health figure on the listing is what sold me — nobody else publishes it. It came in exactly where they said, and the delivery driver walked me through the whole car before handing over the keys.',
  },
  {
    name: 'Marcus Bell', photo: '/img/avatars/m03.jpg', location: 'Columbus, GA', rating: 5,
    item: '2022 BMW M440i xDrive Coupe',
    body: 'Straightforward deal from start to finish. The wire instructions were clear, the title arrived a week later exactly as promised, and the car is spotless. No games, no surprise fees.',
  },
  {
    name: 'Lisa Tanner', photo: '/img/avatars/w02.jpg', location: 'Panama City, FL', rating: 5,
    item: '2021 Honda Accord Sport 2.0T',
    body: 'I set a maximum bid, went to work, and won it for less than my ceiling. Getting the purchase agreement in my inbox the same afternoon made the whole thing feel legitimate.',
  },
  {
    name: 'Roy Hutchinson', photo: '/img/avatars/m04.jpg', location: 'Thomasville, GA', rating: 5,
    item: '2020 Jeep Wrangler Unlimited Rubicon',
    body: 'They listed a stone chip and a scuff on the rear quarter that I would never have noticed in the photos. Finding out they disclose the small stuff is why I will bid here again.',
  },
  {
    name: 'Angela Ferris', photo: '/img/avatars/w03.jpg', location: 'Gainesville, FL', rating: 5,
    item: '2022 Toyota 4Runner TRD Off-Road',
    body: 'First time buying a car sight-unseen and I was nervous. The ten-day window meant my own mechanic could look it over before I was committed. He found nothing. That says it all.',
  },
  {
    name: 'Calvin Marsh', photo: '/img/avatars/m02.jpg', location: 'Tifton, GA', rating: 5,
    item: '2018 Dodge Ram 2500 Laramie Mega Cab',
    body: 'Delivery was on time, price was what was agreed, and the truck matched the listing down to the tyre brand. Simple as that.',
  },
  {
    name: 'Patricia Nguyen', photo: '/img/avatars/w04.jpg', location: 'Mobile, AL', rating: 5,
    item: '2019 Ford F-150 Lariat SuperCrew',
    body: 'Ordered Monday, on my driveway Thursday, and they called with updates twice during transit. I have had worse service buying a sofa.',
  },
  {
    name: 'Elijah Carter', photo: '/img/avatars/m07.jpg', location: 'Savannah, GA', rating: 4,
    item: '2021 Chevrolet Silverado 1500 LT Trail Boss',
    body: 'Only reason this is not five stars is the wire transfer took a day longer than I expected. The truck itself and the way they handled the paperwork were faultless.',
  },
  {
    name: 'James Harrington', photo: '/img/avatars/m05.jpg', location: 'Valdosta, GA', rating: 5,
    item: '2021 GMC Sierra 2500HD Denali',
    body: 'Bought my first truck online through them and the process could not have been smoother. Straight answers on condition, mileage and delivery timeline. It arrived exactly as described, title in hand. Solid outfit — I will be back for the next one.',
  },
  {
    name: 'Maria Delgado', photo: '/img/avatars/w05.jpg', location: 'Dothan, AL', rating: 5,
    item: '2020 Tesla Model X Long Range Plus',
    body: 'I was nervous buying a car I had not seen in person, but the agreement came through the moment I bid, with everything already filled in. No chasing paperwork. They even sent the battery health report before I bid.',
  },
  {
    name: 'Tommy Whitfield', photo: '/img/avatars/m08.jpg', location: 'Moultrie, GA', rating: 5,
    item: '2022 Toyota 4Runner TRD Off-Road',
    body: 'These folks know cars. Listing photos were honest, the mileage was accurate, and when I had a question about the service history I had a call back inside the hour. Delivery coordination was flawless.',
  },
  {
    name: 'Brenda Okafor', photo: '/img/avatars/w06.jpg', location: 'Tallahassee, FL', rating: 5,
    item: '2019 Ford F-150 Lariat SuperCrew',
    body: 'The thirty-day money-back policy is what sold me. I took the truck straight to my own mechanic and he said it was in better shape than expected. Transparent, professional and responsive throughout.',
  },
  {
    name: 'Curtis Nakamura', photo: '/img/avatars/m06.jpg', location: 'Boise, ID', rating: 5,
    item: '2022 BMW M440i xDrive Coupe',
    body: 'Set a maximum bid, went back to work, and got the email that I had won at well under my ceiling. The whole thing ran itself. Invoice, wire details, title and tracking all came through without me having to ask once.',
  },
  {
    name: 'Angela Ruiz', photo: '/img/avatars/w07.jpg', location: 'Amarillo, TX', rating: 5,
    item: '2021 Mercedes-Benz Sprinter 2500',
    body: 'I have bought at physical auctions for fifteen years and this was less hassle than any of them. No buyer premium was the part I did not quite believe until the invoice came and it was exactly the hammer price plus transport.',
  },
];

module.exports = router;
