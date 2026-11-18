/* =========================================================
   controllers/donationsController.js
   Stock side-effects run inside a Mongoose session (atomic).
   ========================================================= */
const mongoose  = require("mongoose");
const Donation  = require("../models/Donation");
const Item      = require("../models/Item");

// GET /api/donations  – returns populated donor + item names
exports.getAll = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name phone")
      .populate("item",  "name unit")
      .sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/donations  – record donation AND increase stock
exports.create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { date, donor, item: itemId, qty } = req.body;

    if (!date || !donor || !itemId || !qty || qty <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "date, donor, item and qty (>0) are required" });
    }

    // Validate date is not in the future
    const today = new Date().toISOString().slice(0, 10);
    if (date > today) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Date cannot be in the future" });
    }

    // Increase stock
    const item = await Item.findByIdAndUpdate(
      itemId,
      { $inc: { qty: qty } },
      { new: true, session }
    );
    if (!item) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Item not found" });
    }

    const [donation] = await Donation.create(
      [{ date, donor, item: itemId, qty }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Return populated
    const populated = await donation.populate([
      { path: "donor", select: "name phone" },
      { path: "item",  select: "name unit" },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/donations/:id  – delete AND reverse stock (floor 0)
exports.remove = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const donation = await Donation.findById(req.params.id).session(session);
    if (!donation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Donation not found" });
    }

    // Reverse stock, never go below 0
    const item = await Item.findById(donation.item).session(session);
    if (item) {
      item.qty = Math.max(0, item.qty - donation.qty);
      await item.save({ session });
    }

    await Donation.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Donation deleted — stock reversed" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};
