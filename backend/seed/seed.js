/* =========================================================
   seed/seed.js
   Run standalone:  npm run seed
   Also exported as seedDatabase() for the /api/seed/reset route.
   ========================================================= */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose     = require("mongoose");
const connectDB    = require("../config/db");
const Item         = require("../models/Item");
const Donor        = require("../models/Donor");
const Donation     = require("../models/Donation");
const Distribution = require("../models/Distribution");

// Date helper
const d = (offsetDays) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().slice(0, 10);
};

/**
 * Wipes all collections and inserts demo data.
 * Called both by the standalone script and by the reset route.
 */
async function seedDatabase() {
  // Wipe
  await Promise.all([
    Item.deleteMany({}),
    Donor.deleteMany({}),
    Donation.deleteMany({}),
    Distribution.deleteMany({}),
  ]);

  // Items
  const createdItems = await Item.insertMany([
    { name: "Winter Jackets",    cat: "Clothes",    qty: 64,  unit: "pcs",    min: 20, exp: "" },
    { name: "Rice 5 kg bags",    cat: "Food",       qty: 18,  unit: "bags",   min: 25, exp: d(120) },
    { name: "Paracetamol 500mg", cat: "Medicines",  qty: 0,   unit: "strips", min: 30, exp: d(200) },
    { name: "School Notebooks",  cat: "Stationery", qty: 240, unit: "pcs",    min: 60, exp: "" },
    { name: "Story Books",       cat: "Books",      qty: 112, unit: "pcs",    min: 30, exp: "" },
    { name: "Blankets",          cat: "Clothes",    qty: 35,  unit: "pcs",    min: 20, exp: "" },
    { name: "Cooking Oil",       cat: "Food",       qty: 22,  unit: "litres", min: 15, exp: d(14) },
  ]);

  // Donors
  const createdDonors = await Donor.insertMany([
    { name: "Anita Sharma",        phone: "9876543210" },
    { name: "Rotary Club Delhi",   phone: "9911223344" },
    { name: "Vikram Mehta",        phone: "9823456789" },
    { name: "Green Valley School", phone: "9988776655" },
  ]);

  // Donations
  await Donation.insertMany([
    { date: d(-1),  donor: createdDonors[0]._id, item: createdItems[0]._id, qty: 10 },
    { date: d(-3),  donor: createdDonors[1]._id, item: createdItems[3]._id, qty: 50 },
    { date: d(-5),  donor: createdDonors[2]._id, item: createdItems[4]._id, qty: 20 },
    { date: d(-7),  donor: createdDonors[3]._id, item: createdItems[1]._id, qty: 5  },
    { date: d(-10), donor: createdDonors[0]._id, item: createdItems[5]._id, qty: 15 },
    { date: d(-12), donor: createdDonors[1]._id, item: createdItems[6]._id, qty: 10 },
  ]);

  // Distributions
  await Distribution.insertMany([
    { date: d(-2),  ben: "Sunrise Shelter",    item: createdItems[0]._id, qty: 5  },
    { date: d(-4),  ben: "City Food Bank",     item: createdItems[1]._id, qty: 3  },
    { date: d(-6),  ben: "Hope Foundation",    item: createdItems[3]._id, qty: 30 },
    { date: d(-8),  ben: "Rainbow Kids NGO",   item: createdItems[4]._id, qty: 10 },
    { date: d(-9),  ben: "Green Valley School",item: createdItems[5]._id, qty: 8  },
    { date: d(-11), ben: "City Food Bank",     item: createdItems[6]._id, qty: 5  },
  ]);

  console.log("✓ Seeded: 7 items, 4 donors, 6 donations, 6 distributions");
}

module.exports = { seedDatabase };

// Run directly: node seed/seed.js
if (require.main === module) {
  connectDB()
    .then(seedDatabase)
    .then(() => mongoose.disconnect())
    .catch((err) => { console.error(err); process.exit(1); });
}
