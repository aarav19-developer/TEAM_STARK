/* =========================================================
   seedData.js  – Initial data for the app
   Dates are computed relative to today so data stays fresh.
   ========================================================= */

const today = new Date();
const d = (offsetDays) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().slice(0, 10);
};

export const CATEGORIES = [
  'Clothes', 'Books', 'Food', 'Medicines', 'Stationery', 'Other',
];

export const CATEGORY_COLORS = {
  Clothes:    '#4F4FD9',
  Books:      '#2F9BD6',
  Food:       '#F5A524',
  Medicines:  '#E5484D',
  Stationery: '#A05CE6',
  Other:      '#8B90AD',
};

export const CATEGORY_EMOJIS = {
  Clothes:    '\uD83D\uDC55',
  Books:      '\uD83D\uDCDA',
  Food:       '\uD83C\uDF5B',
  Medicines:  '\uD83D\uDC8A',
  Stationery: '\u270F\uFE0F',
  Other:      '\uD83D\uDCE6',
};

export const seedItems = [
  { id: 1, name: 'Winter Jackets',      cat: 'Clothes',    qty: 64,  unit: 'pcs',    min: 20, exp: '' },
  { id: 2, name: 'Rice 5 kg bags',      cat: 'Food',       qty: 18,  unit: 'bags',   min: 25, exp: d(120) },
  { id: 3, name: 'Paracetamol 500mg',   cat: 'Medicines',  qty: 0,   unit: 'strips', min: 30, exp: d(200) },
  { id: 4, name: 'School Notebooks',    cat: 'Stationery', qty: 240, unit: 'pcs',    min: 60, exp: '' },
  { id: 5, name: 'Story Books',         cat: 'Books',      qty: 112, unit: 'pcs',    min: 30, exp: '' },
  { id: 6, name: 'Blankets',            cat: 'Clothes',    qty: 35,  unit: 'pcs',    min: 20, exp: '' },
  { id: 7, name: 'Cooking Oil',         cat: 'Food',       qty: 22,  unit: 'litres', min: 15, exp: d(14) },
];

export const seedDonors = [
  { id: 10, name: 'Anita Sharma',       phone: '9876543210' },
  { id: 11, name: 'Rotary Club Delhi',  phone: '9911223344' },
  { id: 12, name: 'Vikram Mehta',       phone: '9823456789' },
  { id: 13, name: 'Green Valley School',phone: '9988776655' },
];

export const seedDonations = [
  { id: 20, date: d(-1),  donor: 10, item: 1, qty: 10 },
  { id: 21, date: d(-3),  donor: 11, item: 4, qty: 50 },
  { id: 22, date: d(-5),  donor: 12, item: 5, qty: 20 },
  { id: 23, date: d(-7),  donor: 13, item: 2, qty: 5  },
  { id: 24, date: d(-10), donor: 10, item: 6, qty: 15 },
  { id: 25, date: d(-12), donor: 11, item: 7, qty: 10 },
];

export const seedDistributions = [
  { id: 30, date: d(-2),  ben: 'Sunrise Shelter',   item: 1, qty: 5  },
  { id: 31, date: d(-4),  ben: 'City Food Bank',     item: 2, qty: 3  },
  { id: 32, date: d(-6),  ben: 'Hope Foundation',    item: 4, qty: 30 },
  { id: 33, date: d(-8),  ben: 'Rainbow Kids NGO',   item: 5, qty: 10 },
  { id: 34, date: d(-9),  ben: 'Green Valley School',item: 6, qty: 8  },
  { id: 35, date: d(-11), ben: 'City Food Bank',     item: 7, qty: 5  },
];

// UID counter starts at 100 (above all seed IDs)
export const INITIAL_UID = 100;
