const db = require('../config/database');

// Create notification (Admin/Trainer only)
const createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, user_type, metadata } = req.body;
    const { userId, userRole } = req.user;
    
    // Check if user is admin or trainer
    if (userRole !== 'admin' && userRole !== 'TRAINER') {
      return res.status(403).json({ 
        success: false, 
        message: "Only admins and trainers can create notifications" 
      });
    }
    
    let targetUsers = [];
    
    // Determine target users based on user_type
    if (user_type === 'all') {
      // Get all users from all tables
      const [users] = await db.query(`
        SELECT id, 'user' as type FROM users WHERE status = 'active'
        UNION ALL
        SELECT id, 'staff' as type FROM staff WHERE status = 'active'
        UNION ALL
        SELECT id, 'student' as type FROM students WHERE status = 'active'
      `);
      targetUsers = users;
    } else if (user_type === 'students') {
      const [students] = await db.query(
        'SELECT id, "student" as type FROM students WHERE status = "active"'
      );
      targetUsers = students;
    } else if (user_type === 'staff') {
      const [staff] = await db.query(
        'SELECT id, "staff" as type FROM staff WHERE status = "active"'
      );
      targetUsers = staff;
    } else if (user_type === 'users') {
      const [users] = await db.query(
        'SELECT id, "user" as type FROM users WHERE status = "active"'
      );
      targetUsers = users;
    } else if (user_type === 'batch') {
      const { batch_id } = req.body;
      const [students] = await db.query(
        'SELECT id, "student" as type FROM students WHERE batch_id = ? AND status = "active"',
        [batch_id]
      );
      targetUsers = students;
    }
    
    // Create notifications for all target users
    const notifications = [];
    for (const targetUser of targetUsers) {
      const [result] = await db.query(
        `INSERT INTO notifications (user_id, user_type, title, message, type, priority, metadata) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [targetUser.id, targetUser.type, title, message, type, priority, JSON.stringify(metadata || {})]
      );
      notifications.push(result.insertId);
      
      // Log notification
      await db.query(
        `INSERT INTO notification_logs (notification_id, sent_to_user_id, sent_to_user_type, status) 
         VALUES (?, ?, ?, 'sent')`,
        [result.insertId, targetUser.id, targetUser.type]
      );
    }
    
    res.status(201).json({ 
      success: true, 
      message: `Notification sent to ${targetUsers.length} users`,
      data: { count: targetUsers.length }
    });
    
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;
    const { limit = 50, offset = 0, type = 'all' } = req.query;
    
    let typeCondition = '';
    if (type !== 'all') {
      typeCondition = 'AND type = ?';
    }
    
    const [notifications] = await db.query(`
      SELECT 
        id, title, message, type, priority, is_read, metadata, created_at
      FROM notifications
      WHERE user_id = ? AND user_type = ?
      ${typeCondition}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, type === 'all' ? [userId, userType, parseInt(limit), parseInt(offset)] 
                       : [userId, userType, type, parseInt(limit), parseInt(offset)]);
    
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total FROM notifications 
      WHERE user_id = ? AND user_type = ?
    `, [userId, userType]);
    
    res.json({ 
      success: true, 
      data: notifications,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userType = req.user.userType;
    
    const [result] = await db.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE id = ? AND user_id = ? AND user_type = ?`,
      [id, userId, userType]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    
    // Update log
    await db.query(
      `UPDATE notification_logs SET status = 'read' WHERE notification_id = ?`,
      [id]
    );
    
    res.json({ success: true, message: "Notification marked as read" });
    
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;
    
    await db.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
      [userId, userType]
    );
    
    res.json({ success: true, message: "All notifications marked as read" });
    
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userType = req.user.userType;
    
    const [result] = await db.query(
      `DELETE FROM notifications WHERE id = ? AND user_id = ? AND user_type = ?`,
      [id, userId, userType]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    
    res.json({ success: true, message: "Notification deleted" });
    
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;
    
    const [result] = await db.query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND user_type = ? AND is_read = FALSE`,
      [userId, userType]
    );
    
    res.json({ success: true, count: result[0].count });
    
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};