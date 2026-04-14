const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// =======================
// STUDENTS MODULE
// =======================

// Get all students
const GetAllStudents = async (req, res) => {
  try {
    const [students] = await db.query("SELECT * FROM `students`");
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new student
const CreateStudent = async (req, res) => {
  try {
    const { 
     full_name, school_name, trade, level, 
      payment_status, amount_paid, total_fees, email, password, phone 
    } = req.body;

    if (!full_name || !school_name || !trade || !level || !payment_status || !amount_paid || !total_fees || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if email already exists
    const [existing] = await db.query("SELECT * FROM `students` WHERE email=?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

     //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    
    const [result] = await db.query(
      "INSERT INTO `students` (`full_name`, `school_name`, `trade`, `level`, `payment_status`, `amount_paid`, `total_fees`, `email`, `password`, `phone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [full_name, school_name, trade, level, payment_status, amount_paid, total_fees, email, hashedPassword, phone]
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
    
    res.status(201).json({ message: "Student created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a student
const UpdateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      full_name, school_name, trade, level, 
      payment_status, amount_paid, total_fees, email, password, phone 
    } = req.body;
    
    await db.query(
      "UPDATE `students` SET `full_name`=?, `school_name`=?, `trade`=?, `level`=?, `payment_status`=?, `amount_paid`=?, `total_fees`=?, `email`=?, `password`=?, `phone`=? WHERE id=?",
      [full_name, school_name, trade, level, payment_status, amount_paid, total_fees, email, password, phone, id]
    );
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a student
const DeleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM `students` WHERE id=?", [id]);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =======================
// TRADES MODULE
// =======================

const GetAllTrades = async (req, res) => {
  try {
    const [trades] = await db.query("SELECT * FROM `trades`");
    res.status(200).json(trades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const CreateTrade = async (req, res) => {
  try {
    const { name, description, duration, fee } = req.body;
    const [result] = await db.query(
      "INSERT INTO `trades` (`name`, `description`, `duration`, `fee`) VALUES (?, ?, ?, ?)",
      [name, description, duration, fee]
    );
    res.status(201).json({ message: "Trade created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateTrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, fee } = req.body;
    await db.query(
      "UPDATE `trades` SET `name`=?, `description`=?, `duration`=?, `fee`=? WHERE id=?",
      [name, description, duration, fee, id]
    );
    res.status(200).json({ message: "Trade updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteTrade = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM `trades` WHERE id=?", [id]);
    res.status(200).json({ message: "Trade deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =======================
// LEVELS MODULE
// =======================

const GetAllLevels = async (req, res) => {
  try {
    const [levels] = await db.query("SELECT * FROM `levels`");
    res.status(200).json(levels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const CreateLevel = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const [result] = await db.query(
      "INSERT INTO `levels` (`name`, `code`, `description`) VALUES (?, ?, ?)",
      [name, code, description]
    );
    res.status(201).json({ message: "Level created", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    await db.query(
      "UPDATE `levels` SET `name`=?, `code`=?, `description`=? WHERE id=?",
      [name, code, description, id]
    );
    res.status(200).json({ message: "Level updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteLevel = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM `levels` WHERE id=?", [id]);
    res.status(200).json({ message: "Level deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  GetAllStudents,
  CreateStudent,
  UpdateStudent,
  DeleteStudent,
  GetAllTrades,
  CreateTrade,
  UpdateTrade,
  DeleteTrade,
  GetAllLevels,
  CreateLevel,
  UpdateLevel,
  DeleteLevel
};
