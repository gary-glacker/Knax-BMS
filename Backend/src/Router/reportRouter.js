const express = require('express');
const router = express.Router();
const { GetSummaryReport } = require("../controller/reportController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/summary", GetSummaryReport);

module.exports = router;
