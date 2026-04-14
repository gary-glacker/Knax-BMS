const express = require('express');
const router = express.Router();
const { GetAllLevels, CreateLevel, UpdateLevel, DeleteLevel } = require("../controller/studentController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/", GetAllLevels);
router.post("/", CreateLevel);
router.put("/:id", UpdateLevel);
router.delete("/:id", DeleteLevel);

module.exports = router;
