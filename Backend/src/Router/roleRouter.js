const express = require('express');
const router = express.Router();
const { GetRoles, CreateRole } = require("../controller/roleController");
const { protect } = require('../middleware/authMiddleware');

router.get("/", GetRoles);
router.post("/", protect, CreateRole);

module.exports = router;
