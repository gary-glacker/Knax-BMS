const db = require('../config/db');

// @desc    Get all interns
// @route   GET /api/interns
const GetAllInterns = async (req, res) => {
    try {
        const [interns] = await db.query(`
            SELECT i.id, i.school, i.start_date, i.end_date, u.name as intern_name, m.name as mentor_name
            FROM interns i
            JOIN users u ON i.user_id = u.id
            LEFT JOIN staff s ON i.mentor_id = s.id
            LEFT JOIN users m ON s.user_id = m.id
        `);
        res.status(200).json(interns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get tasks for interns
// @route   GET /api/interns/tasks
const GetInternTasks = async (req, res) => {
    try {
        const [tasks] = await db.query(`
            SELECT t.id, t.title, t.description, t.deadline, i.school, u.name 
            FROM internship_tasks t
            JOIN interns i ON t.intern_id = i.id
            JOIN users u ON i.user_id = u.id
        `);
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { GetAllInterns, GetInternTasks };
