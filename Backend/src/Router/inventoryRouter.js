const express = require('express');
const router = express.Router();
const { GetInventory, GetMovements } = require("../controller/inventoryController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/", GetInventory);
router.get("/movements", GetMovements);

module.exports = router;
