/* =========================================================
   server.js  – Express entry point for Sahayak backend
   ========================================================= */
require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const connectDB = require("./config/db");

const itemsRouter         = require("./routes/items");
const donorsRouter        = require("./routes/donors");
const donationsRouter     = require("./routes/donations");
const distributionsRouter = require("./routes/distributions");
const dashboardRouter     = require("./routes/dashboard");
const seedRouter          = require("./routes/seed");

const app = express();

// ── Middleware ──
app.use(cors({ origin: "*" })); // tighten in production
app.use(express.json());

// ── Routes ──
app.use("/api/items",         itemsRouter);
app.use("/api/donors",        donorsRouter);
app.use("/api/donations",     donationsRouter);
app.use("/api/distributions", distributionsRouter);
app.use("/api/dashboard",     dashboardRouter);
app.use("/api/seed",          seedRouter); // reset / seed endpoint

// ── Health check ──
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ── 404 ──
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ── Connect DB then start ──
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Sahayak backend running on port ${PORT}`));
});
