const db = require('../config/db');

// @desc    Get all notifications for user
// @route   GET /api/system/notifications
const GetNotifications = async (req, res) => {
    try {
        // Can be filtered by req.user.id
        const user_id = req.user.id;
        const [notifications] = await db.query(
            "SELECT * FROM `notifications` WHERE user_id = ?", 
            [user_id]
        );
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get system audit logs
// @route   GET /api/system/audit-logs
const GetAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT a.id, a.action, a.created_at, u.name 
            FROM audit_logs a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `);
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { GetNotifications, GetAuditLogs };
