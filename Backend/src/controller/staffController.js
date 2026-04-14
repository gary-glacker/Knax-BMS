const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//    Get all staff
//    GET /api/staff
const GetAllStaff = async (req, res) => {
  try {
    // Left join users assuming name might come from users, but returning staff details
    const [staff] = await db.query(`
            SELECT s.id, s.first_name, s.last_name, s.email, s.department, s.role, s.salary, s.phone, u.name 
            FROM staff s
            LEFT JOIN users u ON s.user_id = u.id
        `);
    res.status(200).json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Create a new staff
//    POST /api/staff
const CreateStaff = async (req, res) => {
  try {
    const { first_name, last_name, email, password, department, role, salary, phone } = req.body;

    if (!first_name || !last_name || !email || !password || !department || !role || !salary) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //checking email uniqueness and existing user
    const [existingUser] = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO `staff` (`first_name`, `last_name`, `email`, `password`, `department`, `role`, `salary`, `phone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword, department, role, salary, phone]
    );
    if(result.affectedRows === 1) {
    res.status(201).json({ 
      message: "Staff created", 
      user: {
        id: result.insertId,
        first_name,
        last_name,
        email,
        department,
        role,
        salary,
        phone
        },
        token: generateToken(result.insertId, role), 
     });
    } else {
      res.status(500).json({ message: "Failed to create staff" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Update a staff member
//    PUT /api/staff/:id
const UpdateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password, department, role, salary, phone } = req.body;

    await db.query(
      "UPDATE `staff` SET `first_name`=?, `last_name`=?, `email`=?, `password`=?, `department`=?, `role`=?, `salary`=?, `phone`=? WHERE id=?",
      [first_name, last_name, email, password, department, role, salary, phone, id]
    );
    res.status(200).json({ message: "Staff updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Delete a staff member
//    DELETE /api/staff/:id
const DeleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM `staff` WHERE id=?", [id]);
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Get attendance for all staff
//    GET /api/staff/attendance
const GetAttendance = async (req, res) => {
  try {
    const [attendance] = await db.query(`
            SELECT a.id, a.date, a.status, u.name 
            FROM attendance a
            JOIN staff s ON a.staff_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
        `);
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Add attendance record
//    POST /api/staff/attendance
const AddAttendance = async (req, res) => {
  try {
    const { staff_id, date, status } = req.body;
    if (!staff_id || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      "INSERT INTO `attendance` (`staff_id`, `date`, `status`) VALUES (?, ?, ?)",
      [staff_id, date, status],
    );
    res
      .status(201)
      .json({ message: "Attendance recorded", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Get Payroll
//    GET /api/staff/payroll
const GetPayroll = async (req, res) => {
  try {
    const [payroll] = await db.query(`
            SELECT p.id, p.salary, p.payment_date, u.name 
            FROM payroll p
            JOIN staff s ON p.staff_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
        `);
    res.status(200).json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  GetAllStaff,
  CreateStaff,
  UpdateStaff,
  DeleteStaff,
  GetAttendance,
  AddAttendance,
  GetPayroll,
};
