/* =========================================================
   controllers/distributionsController.js
   Stock side-effects run inside a Mongoose session (atomic).
   ========================================================= */
const mongoose      = require("mongoose");
const Distribution  = require("../models/Distribution");
const Item          = require("../models/Item");

// GET /api/distributions  – populated item name + unit
exports.getAll = async (req, res) => {
  try {
    const distributions = await Distribution.find()
      .populate("item", "name unit")
      .sort({ date: -1 });
    res.json(distributions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/distributions  – record AND deduct stock
exports.create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { date, ben, item: itemId, qty } = req.body;

    if (!date || !ben || !itemId || !qty || qty <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "date, ben, item and qty (>0) are required" });
    }

    const today = new Date().toISOString().slice(0, 10);
    if (date > today) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Date cannot be in the future" });
    }

    // Check stock is sufficient (matches frontend validation)
    const item = await Item.findById(itemId).session(session);
    if (!item) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Item not found" });
    }
    if (qty > item.qty) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Only ${item.qty} ${item.unit} of "${item.name}" in stock`,
      });
    }

    // Deduct stock
    item.qty = Math.max(0, item.qty - qty);
    await item.save({ session });

    const [distribution] = await Distribution.create(
      [{ date, ben, item: itemId, qty }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const populated = await distribution.populate({ path: "item", select: "name unit" });
    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/distributions/:id  – delete AND restore stock
exports.remove = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const distribution = await Distribution.findById(req.params.id).session(session);
    if (!distribution) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Distribution not found" });
    }

    // Restore stock
    await Item.findByIdAndUpdate(
      distribution.item,
      { $inc: { qty: distribution.qty } },
      { session }
    );

    await Distribution.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Distribution deleted — stock restored" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};
