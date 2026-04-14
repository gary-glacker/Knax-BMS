const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// All routes require authentication
router.use(authenticateToken);

// Get notifications
router.get('/', getUserNotifications);
router.get('/unread-count', getUnreadCount);

// Create notification (admin/trainer only)
router.post('/', createNotification);

// Mark notifications
router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;

