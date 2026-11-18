/* =========================================================
   controllers/dashboardController.js
   Aggregated stats for the Dashboard page — single endpoint
   so the frontend makes one call instead of four.
   ========================================================= */
const Item         = require("../models/Item");
const Donor        = require("../models/Donor");
const Donation     = require("../models/Donation");
const Distribution = require("../models/Distribution");

exports.getStats = async (req, res) => {
  try {
    const [items, donors, donations, distributions] = await Promise.all([
      Item.find(),
      Donor.find(),
      Donation.find().populate("donor", "name").populate("item", "name unit"),
      Distribution.find().populate("item", "name unit"),
    ]);

    // ── Summary stats ──
    const totalInStock    = items.reduce((s, i) => s + i.qty, 0);
    const donorCount      = donors.length;
    const totalDistributed = distributions.reduce((s, d) => s + d.qty, 0);

    // Items that need restocking (qty <= 0 or qty < min)
    const needsRestock = items.filter((i) => {
      if (i.qty <= 0)       return true;
      if (i.qty < i.min)    return true;
      return false;
    }).length;

    // ── Stock by category ──
    const catMap = {};
    items.forEach((i) => { catMap[i.cat] = (catMap[i.cat] || 0) + i.qty; });
    const max = Math.max(1, ...Object.values(catMap));
    const stockByCategory = Object.entries(catMap)
      .map(([cat, total]) => ({ cat, total, pct: Math.round((total / max) * 100) }))
      .sort((a, b) => b.total - a.total);

    // ── Recent activity (last 6 events) ──
    const donationEvents = donations.map((d) => ({
      type:      "donation",
      date:      d.date,
      donorName: d.donor?.name ?? "(deleted)",
      itemName:  d.item?.name  ?? "(deleted)",
      qty:       d.qty,
      unit:      d.item?.unit  ?? "",
    }));
    const distributionEvents = distributions.map((d) => ({
      type:     "distribution",
      date:     d.date,
      ben:      d.ben,
      itemName: d.item?.name ?? "(deleted)",
      qty:      d.qty,
      unit:     d.item?.unit ?? "",
    }));
    const recentActivity = [...donationEvents, ...distributionEvents]
      .sort((a, b) => (b.date > a.date ? 1 : -1))
      .slice(0, 6);

    // ── Needs attention (stock / expiry alerts) ──
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attention = [];
    items.forEach((item) => {
      if (item.qty <= 0) {
        attention.push({ itemId: item._id, name: item.name, tag: "Out of stock", level: "error" });
      } else if (item.qty < item.min) {
        attention.push({ itemId: item._id, name: item.name, tag: "Low stock", level: "warning" });
      }
      if (item.exp) {
        const [y, m, d] = item.exp.split("-").map(Number);
        const expDate = new Date(y, m - 1, d);
        const daysLeft = Math.round((expDate - today) / 86400000);
        if (daysLeft < 0) {
          attention.push({ itemId: item._id, name: item.name, tag: "Expired", level: "error" });
        } else if (daysLeft <= 30) {
          attention.push({ itemId: item._id, name: item.name, tag: `Expires in ${daysLeft}d`, level: "warning" });
        }
      }
    });

    res.json({
      stats: { totalInStock, donorCount, totalDistributed, needsRestock, itemTypes: items.length },
      stockByCategory,
      recentActivity,
      attention: attention.slice(0, 8),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
