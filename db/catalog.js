'use strict';

/**
 * Seed catalogue: real-world vehicle specifications used to populate a
 * demonstrable inventory. Prices are in cents.
 *
 * VINs are structurally plausible but deliberately not real vehicles. Replace
 * every listing with your own stock before trading.
 *
 * `photo` names a search term used by db/fetch-images.js to pull matching
 * photography, and maps to the files under public/uploads/listings.
 */

const CATEGORIES = [
  { slug: 'pickup-trucks', name: 'Pickup Trucks', icon: 'pickup', sort_order: 1,
    description: 'Half-ton to one-ton pickups, gas and diesel, 2WD and 4x4.' },
  { slug: 'suvs',          name: 'SUVs',          icon: 'suv',    sort_order: 2,
    description: 'Family SUVs and full-size body-on-frame haulers.' },
  { slug: 'sedans',        name: 'Sedans',        icon: 'sedan',  sort_order: 3,
    description: 'Commuter and executive saloons, petrol, hybrid and electric.' },
  { slug: 'coupes-sports', name: 'Coupes & Sports', icon: 'coupe', sort_order: 4,
    description: 'Two-doors, performance cars and weekend machines.' },
  { slug: 'vans',          name: 'Vans',          icon: 'van',    sort_order: 5,
    description: 'Cargo and passenger vans for trades and fleets.' },
  { slug: 'electric',      name: 'Electric & Hybrid', icon: 'ev', sort_order: 6,
    description: 'Battery-electric and hybrid vehicles with verified battery health.' },
  { slug: 'motorcycles',   name: 'Motorcycles',   icon: 'motorcycle', sort_order: 7,
    description: 'Cruisers, tourers and sport bikes.' },
  { slug: 'commercial',    name: 'Commercial',    icon: 'semi',   sort_order: 8,
    description: 'Box trucks, flatbeds and highway tractors.' },
];

const LISTINGS = [
  {
    slug: '2021-gmc-sierra-2500hd-denali-crew-cab-4x4',
    title: '2021 GMC Sierra 2500HD Denali Crew Cab 4x4',
    category: 'pickup-trucks',
    year: 2021, make: 'GMC', model: 'Sierra 2500HD', trim: 'Denali',
    mileage: 48210, vin: '1GT49REY8MF204817',
    engine_hp: 445, engine_type: '6.6L Duramax Turbo Diesel V8',
    transmission: '10-speed Allison automatic', drivetrain: '4WD',
    fuel_type: 'Diesel', body_style: 'Crew Cab Pickup',
    exterior_color: 'Onyx Black', interior_color: 'Jet Black Leather',
    doors: 4, seats: 5, title_status: 'Clean',
    stock_number: 'PU-40817', photo: 'pickup truck',
    buy_now_price: 6845000, starting_bid: 5100000, reserve_price: 5700000,
    bid_increment: 25000, featured: true, quantity: 2,
    description:
      '2021 GMC Sierra 2500HD Denali Crew Cab 4x4 with 48,210 miles. The 6.6L Duramax ' +
      'turbo diesel paired with the 10-speed Allison, rated at 445 HP and 910 lb-ft, ' +
      'with a factory tow rating of 18,500 lbs conventional.\n\n' +
      'Denali trim throughout: heated and ventilated front seats, heated steering wheel, ' +
      'multi-colour head-up display, Bose premium audio, sunroof and the 15-inch multi-pro ' +
      'tailgate. Fitted with an integrated brake controller, factory fifth-wheel prep ' +
      'package and a spray-in bedliner.\n\n' +
      'Two owners from new, clean title, full service history with the last service at ' +
      '46,900 miles. Tyres at approximately 70 percent. No accident history disclosed on ' +
      'the vehicle report. Drives straight with no warning lights.',
    highlights: [
      '6.6L Duramax diesel, 445 HP / 910 lb-ft',
      '10-speed Allison automatic transmission',
      'Factory fifth-wheel prep and integrated brake controller',
      'Heated and ventilated leather, head-up display, sunroof',
      'Clean title, two owners, full service history',
      'Tyres at approximately 70%',
    ],
    specs: [
      { group: 'Performance & capability', items: [
        { label: 'Horsepower', value: '445 HP' },
        { label: 'Torque', value: '910 lb-ft' },
        { label: 'Max towing', value: '18,500 lbs' },
        { label: 'Payload', value: '3,979 lbs' },
        { label: 'Fuel capacity', value: '36 gal' },
      ] },
      { group: 'Comfort & technology', items: [
        { label: 'Infotainment', value: '8" touchscreen, wireless CarPlay' },
        { label: 'Audio', value: 'Bose premium 7-speaker' },
        { label: 'Seating', value: 'Heated and ventilated leather' },
        { label: 'Driver assist', value: 'Lane departure, forward collision alert' },
      ] },
    ],
  },
  {
    slug: '2020-tesla-model-x-long-range-plus',
    title: '2020 Tesla Model X Long Range Plus',
    category: 'electric',
    year: 2020, make: 'Tesla', model: 'Model X', trim: 'Long Range Plus',
    mileage: 61480, vin: '5YJXCDE22LF108246',
    engine_hp: 670, engine_type: 'Dual Motor All-Wheel Drive, 100 kWh',
    transmission: 'Single-speed automatic', drivetrain: 'AWD',
    fuel_type: 'Electric', body_style: 'Sport Utility',
    exterior_color: 'Pearl White Multi-Coat', interior_color: 'Black Premium',
    doors: 5, seats: 6, title_status: 'Clean',
    stock_number: 'EV-10824', photo: 'tesla electric car',
    buy_now_price: 5290000, starting_bid: 3900000, reserve_price: 4400000,
    bid_increment: 25000, featured: true, quantity: 1,
    description:
      '2020 Tesla Model X Long Range Plus with 61,480 miles. Dual motor all-wheel drive ' +
      'with a 100 kWh pack, 670 HP combined and an EPA range of 351 miles when new.\n\n' +
      'Six-seat configuration with second-row captains chairs, falcon-wing rear doors, ' +
      'panoramic windscreen, premium interior with heated seats throughout, HEPA ' +
      'filtration with Bioweapon Defense Mode, and 22-inch turbine wheels. Autopilot ' +
      'hardware fitted.\n\n' +
      'Battery health tested at 92 percent of original capacity, with the full report ' +
      'available on request. Clean title, one owner, all service completed through Tesla ' +
      'service centres. Tyres replaced at 58,000 miles.',
    highlights: [
      '100 kWh pack, battery health tested at 92%',
      'Dual motor AWD, 670 HP combined',
      'Six-seat layout with captains chairs',
      'Falcon-wing doors and panoramic windscreen',
      'Autopilot hardware, HEPA filtration',
      'New tyres at 58,000 miles',
    ],
    specs: [
      { group: 'Electric drivetrain', items: [
        { label: 'Battery capacity', value: '100 kWh' },
        { label: 'Battery health', value: '92% of original' },
        { label: 'EPA range when new', value: '351 miles' },
        { label: '0–60 mph', value: '4.4 seconds' },
        { label: 'Peak charge rate', value: '250 kW Supercharging' },
      ] },
    ],
  },
  {
    slug: '2018-dodge-ram-2500-laramie-mega-cab-cummins',
    title: '2018 RAM 2500 Laramie Mega Cab Cummins 4x4',
    category: 'pickup-trucks',
    year: 2018, make: 'RAM', model: '2500', trim: 'Laramie Mega Cab',
    mileage: 89340, vin: '3C6UR5NL4JG287104',
    engine_hp: 370, engine_type: '6.7L Cummins Turbo Diesel I6',
    transmission: '6-speed automatic', drivetrain: '4WD',
    fuel_type: 'Diesel', body_style: 'Mega Cab Pickup',
    exterior_color: 'Bright White', interior_color: 'Canyon Brown Leather',
    doors: 4, seats: 5, title_status: 'Clean',
    stock_number: 'PU-28710', photo: 'ram pickup truck',
    buy_now_price: 4180000, starting_bid: 3100000, reserve_price: null,
    bid_increment: 20000, featured: false, quantity: 1,
    description:
      '2018 RAM 2500 Laramie Mega Cab 4x4 with 89,340 miles and the 6.7L Cummins ' +
      'turbo diesel — the engine most buyers are actually looking for.\n\n' +
      'Mega Cab gives the largest rear seat of any pickup, with reclining rear seats and ' +
      'genuine legroom. Laramie trim brings heated and ventilated leather, heated steering ' +
      'wheel, remote start, dual-zone climate and the 8.4-inch Uconnect system. Fitted with ' +
      'a gooseneck hitch, integrated brake controller and running boards.\n\n' +
      'Clean title, no accidents disclosed. Recent service including oil, fuel filters and ' +
      'transmission fluid at 87,500 miles. Tyres at approximately 60 percent. Some light ' +
      'stone chipping to the front bumper, photographed and disclosed.',
    highlights: [
      '6.7L Cummins turbo diesel, 370 HP / 800 lb-ft',
      'Mega Cab — largest rear cabin in class',
      'Gooseneck hitch and integrated brake controller',
      'Heated and ventilated leather, remote start',
      'Serviced at 87,500 miles',
      'Light stone chipping to front bumper — disclosed',
    ],
    specs: [
      { group: 'Performance & capability', items: [
        { label: 'Horsepower', value: '370 HP' },
        { label: 'Torque', value: '800 lb-ft' },
        { label: 'Max towing', value: '15,940 lbs' },
        { label: 'Payload', value: '2,510 lbs' },
      ] },
    ],
  },
  {
    slug: '2022-toyota-4runner-trd-off-road-premium',
    title: '2022 Toyota 4Runner TRD Off-Road Premium',
    category: 'suvs',
    year: 2022, make: 'Toyota', model: '4Runner', trim: 'TRD Off-Road Premium',
    mileage: 34760, vin: 'JTEBU5JR9N5981042',
    engine_hp: 270, engine_type: '4.0L V6',
    transmission: '5-speed automatic', drivetrain: '4WD',
    fuel_type: 'Gasoline', body_style: 'Sport Utility',
    exterior_color: 'Magnetic Grey Metallic', interior_color: 'Black SofTex',
    doors: 5, seats: 5, title_status: 'Clean',
    stock_number: 'SU-98104', photo: 'toyota suv',
    buy_now_price: 4695000, starting_bid: 3500000, reserve_price: 3950000,
    bid_increment: 20000, featured: true, quantity: 2,
    description:
      '2022 Toyota 4Runner TRD Off-Road Premium with 34,760 miles. The body-on-frame ' +
      '4Runner remains the one people keep for a decade, and this one has been looked after.\n\n' +
      'TRD Off-Road Premium adds a locking rear differential, Crawl Control, Multi-Terrain ' +
      'Select, TRD-tuned Bilstein shocks, heated SofTex seats, sunroof and the JBL premium ' +
      'audio system. Fitted with all-weather floor liners and a tow package.\n\n' +
      'Clean title, one owner, no accidents disclosed. Full Toyota service history. Tyres at ' +
      'approximately 80 percent on the factory alloys. Nothing outstanding — a genuinely ' +
      'tidy example.',
    highlights: [
      'Locking rear differential and Crawl Control',
      'TRD-tuned Bilstein shocks',
      'Heated SofTex seating, sunroof, JBL audio',
      'Factory tow package fitted',
      'One owner, clean title, full Toyota history',
      'Tyres at approximately 80%',
    ],
    specs: [
      { group: 'Off-road capability', items: [
        { label: 'Ground clearance', value: '9.6 in' },
        { label: 'Approach angle', value: '33 degrees' },
        { label: 'Rear differential', value: 'Electronic locking' },
        { label: 'Max towing', value: '5,000 lbs' },
      ] },
    ],
  },
  {
    slug: '2021-honda-accord-sport-2-0t',
    title: '2021 Honda Accord Sport 2.0T',
    category: 'sedans',
    year: 2021, make: 'Honda', model: 'Accord', trim: 'Sport 2.0T',
    mileage: 41920, vin: '1HGCV2F31MA042118',
    engine_hp: 252, engine_type: '2.0L Turbocharged I4',
    transmission: '10-speed automatic', drivetrain: 'FWD',
    fuel_type: 'Gasoline', body_style: 'Sedan',
    exterior_color: 'Modern Steel Metallic', interior_color: 'Black Cloth',
    doors: 4, seats: 5, title_status: 'Clean',
    stock_number: 'SD-04211', photo: 'honda sedan car',
    buy_now_price: 2698000, starting_bid: 1950000, reserve_price: null,
    bid_increment: 15000, featured: false, quantity: 3,
    description:
      '2021 Honda Accord Sport 2.0T with 41,920 miles. The 2.0-litre turbo with the ' +
      '10-speed automatic is the quick one — 252 HP and 273 lb-ft, and it still returns ' +
      'sensible economy on a commute.\n\n' +
      'Sport trim brings 19-inch alloys, a leather-wrapped steering wheel, dual exhaust, ' +
      'heated front seats, remote start and the full Honda Sensing driver assistance suite. ' +
      'Apple CarPlay and Android Auto fitted.\n\n' +
      'Clean title, no accidents disclosed, full service history. Brake pads and discs ' +
      'replaced at 39,000 miles. Tyres at approximately 65 percent. A straightforward, ' +
      'well-kept daily car.',
    highlights: [
      '2.0L turbo, 252 HP / 273 lb-ft',
      '10-speed automatic transmission',
      'Full Honda Sensing driver assistance suite',
      'Heated front seats and remote start',
      'Brakes replaced at 39,000 miles',
      'Clean title, full service history',
    ],
    specs: [
      { group: 'Performance & economy', items: [
        { label: 'Horsepower', value: '252 HP' },
        { label: 'Torque', value: '273 lb-ft' },
        { label: 'EPA combined', value: '26 mpg' },
        { label: '0–60 mph', value: '5.7 seconds' },
      ] },
    ],
  },
  {
    slug: '2019-ford-f-150-lariat-supercrew-4x4',
    title: '2019 Ford F-150 Lariat SuperCrew 4x4',
    category: 'pickup-trucks',
    year: 2019, make: 'Ford', model: 'F-150', trim: 'Lariat SuperCrew',
    mileage: 72150, vin: '1FTEW1E58KFA71209',
    engine_hp: 375, engine_type: '3.5L EcoBoost Twin-Turbo V6',
    transmission: '10-speed automatic', drivetrain: '4WD',
    fuel_type: 'Gasoline', body_style: 'SuperCrew Pickup',
    exterior_color: 'Agate Black', interior_color: 'Black Leather',
    doors: 4, seats: 5, title_status: 'Clean',
    stock_number: 'PU-71209', photo: 'ford pickup truck',
    buy_now_price: 3480000, starting_bid: 2600000, reserve_price: 2900000,
    bid_increment: 20000, featured: false, quantity: 1,
    description:
      '2019 Ford F-150 Lariat SuperCrew 4x4 with 72,150 miles and the 3.5 EcoBoost — ' +
      '375 HP, 470 lb-ft and a 13,200 lb tow rating.\n\n' +
      'Lariat trim with heated and ventilated leather, heated steering wheel, dual-zone ' +
      'climate, the 8-inch SYNC 3 system with CarPlay, and a 360-degree camera. Fitted ' +
      'with a spray-in bedliner, tonneau cover, running boards and the max trailer tow ' +
      'package with integrated brake controller.\n\n' +
      'Clean title, no accidents disclosed. Serviced at 70,000 miles including plugs and ' +
      'transmission fluid. New tyres at 68,000 miles. Normal wear to the driver seat ' +
      'bolster, photographed.',
    highlights: [
      '3.5L EcoBoost, 375 HP / 470 lb-ft',
      'Max trailer tow package, 13,200 lb rating',
      '360-degree camera and SYNC 3 with CarPlay',
      'Heated and ventilated leather',
      'New tyres at 68,000 miles',
      'Driver seat bolster wear — disclosed',
    ],
    specs: [
      { group: 'Performance & capability', items: [
        { label: 'Horsepower', value: '375 HP' },
        { label: 'Torque', value: '470 lb-ft' },
        { label: 'Max towing', value: '13,200 lbs' },
        { label: 'Payload', value: '1,993 lbs' },
      ] },
    ],
  },
  {
    slug: '2020-jeep-wrangler-unlimited-rubicon',
    title: '2020 Jeep Wrangler Unlimited Rubicon',
    category: 'suvs',
    year: 2020, make: 'Jeep', model: 'Wrangler Unlimited', trim: 'Rubicon',
    mileage: 55830, vin: '1C4HJXFG7LW258317',
    engine_hp: 285, engine_type: '3.6L Pentastar V6',
    transmission: '8-speed automatic', drivetrain: '4WD',
    fuel_type: 'Gasoline', body_style: 'Sport Utility',
    exterior_color: 'Firecracker Red', interior_color: 'Black Leather',
    doors: 4, seats: 5, title_status: 'Clean',
    stock_number: 'SU-25831', photo: 'jeep wrangler',
    buy_now_price: 4290000, starting_bid: 3200000, reserve_price: 3600000,
    bid_increment: 20000, featured: false, quantity: 1,
    description:
      '2020 Jeep Wrangler Unlimited Rubicon with 55,830 miles. The Rubicon is the one with ' +
      'the hardware: Rock-Trac transfer case, front and rear Tru-Lok lockers, electronic ' +
      'sway bar disconnect and 33-inch BFGoodrich all-terrains.\n\n' +
      'Fitted with the body-colour three-piece hardtop, heated leather seats, heated steering ' +
      'wheel, the 8.4-inch Uconnect system with CarPlay, and LED lighting all round. Steel ' +
      'bumpers and rock rails fitted.\n\n' +
      'Clean title, no accidents disclosed. Serviced regularly with records. Tyres at ' +
      'approximately 55 percent. Light trail pinstriping to the lower panels, honestly ' +
      'photographed — this one has been used as intended and maintained properly.',
    highlights: [
      'Rock-Trac transfer case with 4:1 low range',
      'Front and rear Tru-Lok differential lockers',
      'Electronic front sway bar disconnect',
      'Body-colour three-piece hardtop',
      'Heated leather seats and steering wheel',
      'Light trail pinstriping — disclosed',
    ],
    specs: [
      { group: 'Off-road capability', items: [
        { label: 'Crawl ratio', value: '84:1' },
        { label: 'Ground clearance', value: '10.8 in' },
        { label: 'Approach angle', value: '44 degrees' },
        { label: 'Water fording', value: '30 in' },
      ] },
    ],
  },
  {
    slug: '2022-bmw-m440i-xdrive-coupe',
    title: '2022 BMW M440i xDrive Coupe',
    category: 'coupes-sports',
    year: 2022, make: 'BMW', model: 'M440i', trim: 'xDrive Coupe',
    mileage: 22410, vin: 'WBA53AT08NCK41207',
    engine_hp: 382, engine_type: '3.0L TwinPower Turbo I6 with 48V mild hybrid',
    transmission: '8-speed Steptronic automatic', drivetrain: 'AWD',
    fuel_type: 'Gasoline', body_style: 'Coupe',
    exterior_color: 'Portimao Blue Metallic', interior_color: 'Cognac Vernasca Leather',
    doors: 2, seats: 4, title_status: 'Clean',
    stock_number: 'CP-41207', photo: 'bmw coupe car',
    buy_now_price: 5480000, starting_bid: 4100000, reserve_price: 4600000,
    bid_increment: 25000, featured: true, quantity: 1,
    description:
      '2022 BMW M440i xDrive Coupe with 22,410 miles. The B58 straight-six with 48-volt ' +
      'mild hybrid assistance — 382 HP, 369 lb-ft, and 0–60 in 4.3 seconds through xDrive.\n\n' +
      'Specified with the Premium Package, M Sport differential, adaptive M suspension, ' +
      'Harman Kardon surround audio, head-up display, wireless CarPlay and Android Auto, ' +
      'and Cognac Vernasca leather. Nineteen-inch M double-spoke wheels.\n\n' +
      'Clean title, one owner, no accidents disclosed. Remaining BMW factory warranty and ' +
      'maintenance coverage transfers to the new owner. Tyres at approximately 75 percent. ' +
      'Presented in genuinely excellent condition throughout.',
    highlights: [
      'B58 3.0L turbo six with 48V mild hybrid, 382 HP',
      'M Sport differential and adaptive M suspension',
      'Harman Kardon audio and head-up display',
      'Cognac Vernasca leather, 19" M wheels',
      'Remaining BMW factory warranty transfers',
      'One owner, clean title, 22k miles',
    ],
    specs: [
      { group: 'Performance', items: [
        { label: 'Horsepower', value: '382 HP' },
        { label: 'Torque', value: '369 lb-ft' },
        { label: '0–60 mph', value: '4.3 seconds' },
        { label: 'Top speed', value: '155 mph (limited)' },
      ] },
    ],
  },
  {
    slug: '2021-mercedes-benz-sprinter-2500-cargo-van',
    title: '2021 Mercedes-Benz Sprinter 2500 Cargo Van',
    category: 'vans',
    year: 2021, make: 'Mercedes-Benz', model: 'Sprinter 2500', trim: 'High Roof 170" WB',
    mileage: 68920, vin: 'W1Y4EDHY9MT062418',
    engine_hp: 188, engine_type: '2.0L Turbo Diesel I4',
    transmission: '7-speed automatic', drivetrain: 'RWD',
    fuel_type: 'Diesel', body_style: 'Cargo Van',
    exterior_color: 'Arctic White', interior_color: 'Black Vinyl',
    doors: 4, seats: 2, title_status: 'Clean',
    stock_number: 'VN-06241', photo: 'cargo van',
    buy_now_price: 4150000, starting_bid: 3100000, reserve_price: 3450000,
    bid_increment: 20000, featured: false, quantity: 2,
    description:
      '2021 Mercedes-Benz Sprinter 2500 High Roof with the 170-inch wheelbase and 68,920 ' +
      'miles. Stand-up cargo height and genuine load length — the standard choice for ' +
      'trades, delivery fleets and conversions.\n\n' +
      'Fitted with the MBUX 7-inch system with CarPlay, reversing camera, Crosswind Assist, ' +
      'Active Brake Assist and a bulkhead partition. Wood floor and wall lining already ' +
      'installed. Rear barn doors opening to 270 degrees plus a sliding side door.\n\n' +
      'Clean title, single fleet owner, serviced on schedule at Mercedes commercial centres ' +
      'with full records. Tyres at approximately 65 percent. Normal fleet wear to the load ' +
      'area, photographed and disclosed.',
    highlights: [
      'High roof, 170" wheelbase — stand-up cargo height',
      'Wood floor and wall lining installed',
      '270-degree barn doors and sliding side door',
      'Crosswind Assist and Active Brake Assist',
      'Single fleet owner with full Mercedes service records',
      'Normal load-area wear — disclosed',
    ],
    specs: [
      { group: 'Load & capability', items: [
        { label: 'Cargo volume', value: '533 cu ft' },
        { label: 'Payload', value: '3,461 lbs' },
        { label: 'Max load length', value: '14 ft 8 in' },
        { label: 'Interior height', value: '6 ft 4 in' },
      ] },
    ],
  },
  {
    slug: '2022-harley-davidson-road-glide-special',
    title: '2022 Harley-Davidson Road Glide Special',
    category: 'motorcycles',
    year: 2022, make: 'Harley-Davidson', model: 'Road Glide', trim: 'Special',
    mileage: 9840, vin: '1HD1KRC15NB618402',
    engine_hp: 93, engine_type: 'Milwaukee-Eight 114 V-Twin',
    transmission: '6-speed Cruise Drive', drivetrain: 'RWD',
    fuel_type: 'Gasoline', body_style: 'Touring Motorcycle',
    exterior_color: 'Vivid Black', interior_color: 'n/a',
    doors: 0, seats: 2, title_status: 'Clean',
    stock_number: 'MC-61840', photo: 'harley davidson motorcycle',
    buy_now_price: 2695000, starting_bid: 1980000, reserve_price: null,
    bid_increment: 15000, featured: false, quantity: 1,
    description:
      '2022 Harley-Davidson Road Glide Special with only 9,840 miles. The Milwaukee-Eight ' +
      '114 with 119 lb-ft of torque, in the frame-mounted shark-nose fairing that makes ' +
      'the Road Glide so composed at highway speed.\n\n' +
      'Fitted with the Boom! Box GTS infotainment system with a 6.5-inch touchscreen and ' +
      'CarPlay, cruise control, ABS, a security system with fob, and hard saddlebags. ' +
      'Premium Showa suspension front and rear.\n\n' +
      'Clean title, one owner, garage kept and dealer serviced. Tyres essentially new. ' +
      'Genuinely low mileage and presented as such.',
    highlights: [
      'Milwaukee-Eight 114, 119 lb-ft torque',
      'Frame-mounted shark-nose fairing',
      'Boom! Box GTS with 6.5" touchscreen and CarPlay',
      'ABS, cruise control and security system',
      'Only 9,840 miles, garage kept',
      'One owner, clean title, dealer serviced',
    ],
    specs: [
      { group: 'Engine & chassis', items: [
        { label: 'Displacement', value: '114 cu in (1,868 cc)' },
        { label: 'Torque', value: '119 lb-ft @ 3,000 rpm' },
        { label: 'Seat height', value: '26.1 in' },
        { label: 'Fuel capacity', value: '6 gal' },
      ] },
    ],
  },
  {
    slug: '2023-peterbilt-389-sleeper-tractor',
    title: '2023 Peterbilt 389 Sleeper Tractor',
    category: 'commercial',
    year: 2023, make: 'Peterbilt', model: '389', trim: '72" Sleeper',
    mileage: 184600, vin: '1XPXD49X1PD810247',
    engine_hp: 565, engine_type: 'PACCAR MX-13 Turbo Diesel I6',
    transmission: '18-speed Eaton Fuller manual', drivetrain: '6x4',
    fuel_type: 'Diesel', body_style: 'Sleeper Tractor',
    exterior_color: 'Legendary Blue', interior_color: 'Grey Vantage',
    doors: 2, seats: 2, title_status: 'Clean',
    stock_number: 'CM-81024', photo: 'semi truck peterbilt',
    buy_now_price: 13850000, starting_bid: 10400000, reserve_price: 11600000,
    bid_increment: 50000, featured: true, quantity: 1,
    description:
      '2023 Peterbilt 389 with a 72-inch sleeper and 184,600 miles — low for a highway ' +
      'tractor of this age. PACCAR MX-13 rated at 565 HP and 1,850 lb-ft, behind an ' +
      '18-speed Eaton Fuller.\n\n' +
      'Specified with a 280-inch wheelbase, dual 150-gallon aluminium tanks, full ' +
      'polished aluminium wheels, Vantage interior with refrigerator and inverter, ' +
      'and an APU. Air-ride cab and suspension.\n\n' +
      'Clean title, single owner-operator, complete maintenance records. DPF and DEF ' +
      'systems serviced at 180,000 miles. New drive tyres at 178,000 miles, steers at ' +
      'approximately 70 percent. DOT inspection current.',
    highlights: [
      'PACCAR MX-13, 565 HP / 1,850 lb-ft',
      '18-speed Eaton Fuller manual',
      '72" sleeper with refrigerator, inverter and APU',
      'Dual 150-gallon aluminium tanks',
      'New drive tyres at 178,000 miles',
      'Single owner-operator, full records, DOT current',
    ],
    specs: [
      { group: 'Drivetrain & capability', items: [
        { label: 'Horsepower', value: '565 HP' },
        { label: 'Torque', value: '1,850 lb-ft' },
        { label: 'Wheelbase', value: '280 in' },
        { label: 'Fuel capacity', value: '300 gal (dual tanks)' },
        { label: 'Rear axle ratio', value: '3.36' },
      ] },
    ],
  },
  {
    slug: '2021-hyundai-ioniq-5-limited-awd',
    title: '2021 Hyundai IONIQ 5 Limited AWD',
    category: 'electric',
    year: 2021, make: 'Hyundai', model: 'IONIQ 5', trim: 'Limited AWD',
    mileage: 28470, vin: 'KM8KRDAF4MU042817',
    engine_hp: 320, engine_type: 'Dual Motor All-Wheel Drive, 77.4 kWh',
    transmission: 'Single-speed automatic', drivetrain: 'AWD',
    fuel_type: 'Electric', body_style: 'Crossover',
    exterior_color: 'Cyber Grey Metallic', interior_color: 'Dark Pebble Grey',
    doors: 5, seats: 5, title_status: 'Clean',
    stock_number: 'EV-04281', photo: 'electric car charging',
    buy_now_price: 3890000, starting_bid: 2900000, reserve_price: null,
    bid_increment: 20000, featured: false, quantity: 2,
    description:
      '2021 Hyundai IONIQ 5 Limited AWD with 28,470 miles. The 800-volt architecture is ' +
      'the headline — 10 to 80 percent in about 18 minutes on a 350 kW charger, which ' +
      'very few cars at this price can match.\n\n' +
      'Limited AWD trim with the 77.4 kWh pack, 320 HP combined, dual 12.3-inch displays, ' +
      'augmented reality head-up display, Bose premium audio, heated and ventilated ' +
      'relaxation front seats, a panoramic sunroof, and Vehicle-to-Load (V2L) power export.\n\n' +
      'Clean title, one owner, no accidents disclosed. Battery health tested at 96 percent ' +
      'of original capacity. Remaining Hyundai battery warranty transfers. Tyres at ' +
      'approximately 70 percent.',
    highlights: [
      '800V architecture — 10–80% in about 18 minutes',
      '77.4 kWh pack, battery health tested at 96%',
      'Dual motor AWD, 320 HP combined',
      'Vehicle-to-Load (V2L) power export',
      'Augmented reality head-up display, Bose audio',
      'Remaining Hyundai battery warranty transfers',
    ],
    specs: [
      { group: 'Electric drivetrain', items: [
        { label: 'Battery capacity', value: '77.4 kWh' },
        { label: 'Battery health', value: '96% of original' },
        { label: 'EPA range when new', value: '256 miles' },
        { label: 'Peak charge rate', value: '350 kW (800V)' },
        { label: '0–60 mph', value: '5.1 seconds' },
      ] },
    ],
  },
];

module.exports = { CATEGORIES, LISTINGS };
