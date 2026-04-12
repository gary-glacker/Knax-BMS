const express = require('express');
const router = express.Router();
const { GetNotifications, GetAuditLogs } = require("../controller/systemController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/notifications", GetNotifications);
router.get("/audit-logs", GetAuditLogs);

module.exports = router;
