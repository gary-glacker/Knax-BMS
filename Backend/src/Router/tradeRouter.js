const express = require('express');
const router = express.Router();
const { GetAllTrades, CreateTrade, UpdateTrade, DeleteTrade } = require("../controller/studentController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/", GetAllTrades);
router.post("/", CreateTrade);
router.put("/:id", UpdateTrade);
router.delete("/:id", DeleteTrade);

module.exports = router;
