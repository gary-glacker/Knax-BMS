const express = require('express');
const router = express.Router();
const { GetAllStudents, CreateStudent, UpdateStudent, DeleteStudent } = require("../controller/studentController");
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get("/", GetAllStudents);
router.post("/", CreateStudent);
router.put("/:id", UpdateStudent);
router.delete("/:id", DeleteStudent);

module.exports = router;
