const express = require('express');
const router = express.Router();
const { GetAllStaff, CreateStaff, GetAttendance, AddAttendance, GetPayroll } = require("../controller/staffController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/", GetAllStaff);
router.post("/", CreateStaff);

router.get("/attendance", GetAttendance);
router.post("/attendance", AddAttendance);

router.get("/payroll", GetPayroll);

module.exports = router;
