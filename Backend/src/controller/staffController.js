const db = require('../config/db');

// @desc    Get all staff
// @route   GET /api/staff
const GetAllStaff = async (req, res) => {
    try {
        const [staff] = await db.query(`
            SELECT s.id, s.department, s.position, u.name, u.email 
            FROM staff s
            JOIN users u ON s.user_id = u.id
        `);
        res.status(200).json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Create a new staff
// @route   POST /api/staff
const CreateStaff = async (req, res) => {
    try {
        const { user_id, department, position } = req.body;
        if (!user_id || !department || !position) {
            return res.status(400).json({ message: "Please provide user_id, department, and position" });
        }
        
        const [result] = await db.query(
            "INSERT INTO `staff` (`user_id`, `department`, `position`) VALUES (?, ?, ?)",
            [user_id, department, position]
        );
        res.status(201).json({ message: "Staff created", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get attendance for all staff
// @route   GET /api/staff/attendance
const GetAttendance = async (req, res) => {
    try {
        const [attendance] = await db.query(`
            SELECT a.id, a.date, a.status, u.name 
            FROM attendance a
            JOIN staff s ON a.staff_id = s.id
            JOIN users u ON s.user_id = u.id
        `);
        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Add attendance record
// @route   POST /api/staff/attendance
const AddAttendance = async (req, res) => {
    try {
        const { staff_id, date, status } = req.body;
        if (!staff_id || !date || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const [result] = await db.query(
            "INSERT INTO `attendance` (`staff_id`, `date`, `status`) VALUES (?, ?, ?)",
            [staff_id, date, status]
        );
        res.status(201).json({ message: "Attendance recorded", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get Payroll
// @route   GET /api/staff/payroll
const GetPayroll = async (req, res) => {
    try {
        const [payroll] = await db.query(`
            SELECT p.id, p.salary, p.payment_date, u.name 
            FROM payroll p
            JOIN staff s ON p.staff_id = s.id
            JOIN users u ON s.user_id = u.id
        `);
        res.status(200).json(payroll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { GetAllStaff, CreateStaff, GetAttendance, AddAttendance, GetPayroll };
