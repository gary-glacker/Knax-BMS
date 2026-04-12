const express = require('express');
const router = express.Router();
const { GetAllInterns, GetInternTasks } = require("../controller/internController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/", GetAllInterns);
router.get("/tasks", GetInternTasks);

module.exports = router;
