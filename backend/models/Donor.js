/* =========================================================
   models/Donor.js
   ========================================================= */
const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true, unique: true },
    phone: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);
