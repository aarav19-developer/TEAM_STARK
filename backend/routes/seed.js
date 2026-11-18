/* =========================================================
   routes/seed.js  – Reset DB to demo data
   POST /api/seed/reset
   ========================================================= */
const express  = require("express");
const router   = express.Router();
const { seedDatabase } = require("../seed/seed");

router.post("/reset", async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: "Database reset to demo data" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
