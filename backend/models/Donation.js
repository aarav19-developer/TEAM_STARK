/* =========================================================
   models/Donation.js
   donor → ref Donor, item → ref Item
   ========================================================= */
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    date:  { type: String, required: true }, // YYYY-MM-DD
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
    item:  { type: mongoose.Schema.Types.ObjectId, ref: "Item",  required: true },
    qty:   { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
