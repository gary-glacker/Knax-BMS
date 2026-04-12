const db = require('../config/db');

// @desc    Get all roles
// @route   GET /api/roles
const GetRoles = async (req, res) => {
    try {
        const [roles] = await db.query("SELECT * FROM `roles`");
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Create a new role
// @route   POST /api/roles
const CreateRole = async (req, res) => {
    try {
        const { role_name } = req.body;
        if (!role_name) {
            return res.status(400).json({ message: "Role name is required" });
        }
        
        const [result] = await db.query("INSERT INTO `roles` (`role_name`) VALUES (?)", [role_name]);
        res.status(201).json({ message: "Role created", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { GetRoles, CreateRole };
