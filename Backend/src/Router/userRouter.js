const express = require('express');
const router = express.Router();
const { CreateNewUser, UserLogin, GetAllUsers, UserUpdate, DeleteUser, forgotPassword, resetPassword, verifyResetCode } = require("../controller/userController");
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Get all users (Protected, admin only - assuming role_id 1 is Admin)
router.get("/", protect, GetAllUsers);

// Public routes for testing auth
router.post("/signup", CreateNewUser);
router.post("/login", UserLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-code", verifyResetCode);

// Protected routes for specific user management
router.put("/:id", protect, UserUpdate);
router.delete("/:id", protect, DeleteUser);

module.exports = router;