const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/dashboardController");

router.get("/", ctrl.getStats);

module.exports = router;
