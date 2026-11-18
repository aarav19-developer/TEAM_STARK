/* =========================================================
   models/Item.js
   Fields mirror the frontend: name, cat, qty, unit, min, exp
   ========================================================= */
const mongoose = require("mongoose");

const CATEGORIES = ["Clothes", "Books", "Food", "Medicines", "Stationery", "Other"];

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    cat:  { type: String, required: true, enum: CATEGORIES },
    qty:  { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, required: true, trim: true },
    min:  { type: Number, required: true, min: 0, default: 0 },
    exp:  { type: String, default: "" }, // YYYY-MM-DD string or empty
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
