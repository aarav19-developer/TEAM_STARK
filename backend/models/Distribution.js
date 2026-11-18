/* =========================================================
   models/Distribution.js
   ben is a free-text beneficiary name (not a FK)
   item → ref Item
   ========================================================= */
const mongoose = require("mongoose");

const distributionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    ben:  { type: String, required: true, trim: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    qty:  { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Distribution", distributionSchema);
