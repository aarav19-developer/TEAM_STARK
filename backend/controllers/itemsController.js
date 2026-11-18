/* =========================================================
   controllers/itemsController.js
   ========================================================= */
const Item = require("../models/Item");

// GET /api/items
exports.getAll = async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/items/:id
exports.getOne = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/items
exports.create = async (req, res) => {
  try {
    const { name, cat, qty, unit, min, exp } = req.body;

    // duplicate name check
    const exists = await Item.findOne({ name: name?.trim() });
    if (exists) return res.status(400).json({ message: "An item with this name already exists" });

    const item = await Item.create({ name, cat, qty, unit, min, exp: exp || "" });
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "An item with this name already exists" });
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/items/:id
exports.update = async (req, res) => {
  try {
    const { name, cat, qty, unit, min, exp } = req.body;

    // duplicate name check (exclude self)
    if (name) {
      const exists = await Item.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (exists) return res.status(400).json({ message: "An item with this name already exists" });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, cat, qty, unit, min, exp: exp || "" },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "An item with this name already exists" });
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/items/:id
exports.remove = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    // Note: past donation/distribution records keep the item ref but it resolves to null
    // The frontend already handles the "—" fallback for deleted items
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
