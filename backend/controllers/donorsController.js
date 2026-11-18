/* =========================================================
   controllers/donorsController.js
   ========================================================= */
const Donor    = require("../models/Donor");
const Donation = require("../models/Donation");

// GET /api/donors
exports.getAll = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ name: 1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/donors/:id
exports.getOne = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/donors
exports.create = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const exists = await Donor.findOne({ name: name?.trim() });
    if (exists) return res.status(400).json({ message: "A donor with this name already exists" });

    const donor = await Donor.create({ name, phone: phone || "" });
    res.status(201).json(donor);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "A donor with this name already exists" });
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/donors/:id
exports.update = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (name) {
      const exists = await Donor.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (exists) return res.status(400).json({ message: "A donor with this name already exists" });
    }

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { name, phone: phone || "" },
      { new: true, runValidators: true }
    );
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "A donor with this name already exists" });
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/donors/:id
exports.remove = async (req, res) => {
  try {
    // Block deletion if donor has existing donations (matches frontend rule)
    const hasDonations = await Donation.exists({ donor: req.params.id });
    if (hasDonations) {
      return res.status(400).json({ message: "Cannot delete — donor has existing donations" });
    }

    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json({ message: "Donor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
