const db = require("../config/db");

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
      first_name, last_name, full_name, school_name, trade, level, 
      payment_status, amount_paid, total_fees, registration_date, email, phone 
    } = req.body;
    
    const [result] = await db.query(
      "INSERT INTO `students` (`first_name`, `last_name`, `full_name`, `school_name`, `trade`, `level`, `payment_status`, `amount_paid`, `total_fees`, `registration_date`, `email`, `phone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, full_name, school_name, trade, level, payment_status, amount_paid, total_fees, registration_date, email, phone]
    );
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
      first_name, last_name, full_name, school_name, trade, level, 
      payment_status, amount_paid, total_fees, email, phone 
    } = req.body;
    
    await db.query(
      "UPDATE `students` SET `first_name`=?, `last_name`=?, `full_name`=?, `school_name`=?, `trade`=?, `level`=?, `payment_status`=?, `amount_paid`=?, `total_fees`=?, `email`=?, `phone`=? WHERE id=?",
      [first_name, last_name, full_name, school_name, trade, level, payment_status, amount_paid, total_fees, email, phone, id]
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

module.exports = {
  GetAllStudents,
  CreateStudent,
  UpdateStudent,
  DeleteStudent
};
