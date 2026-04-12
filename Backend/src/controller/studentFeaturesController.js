const db = require('../config/db');

// --- STUDY MODELS ---
const getStudyModels = async (req, res) => {
  try {
    const [models] = await db.query('SELECT * FROM study_models ORDER BY created_at DESC');
    res.status(200).json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching study models' });
  }
};

const createStudyModel = async (req, res) => {
  try {
    const { title, description, file_url } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    
    const [result] = await db.query(
      'INSERT INTO study_models (title, description, file_url) VALUES (?, ?, ?)',
      [title, description, file_url]
    );

    res.status(201).json({ message: 'Study model created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating study model' });
  }
};

// --- EVENTS ---
const getEvents = async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, event_date } = req.body;
    if (!title || !event_date) return res.status(400).json({ message: 'Title and event_date are required' });
    
    const [result] = await db.query(
      'INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)',
      [title, description, event_date]
    );

    res.status(201).json({ message: 'Event created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

// --- WHATSAPP GROUPS ---
const getGroups = async (req, res) => {
  try {
    const [groups] = await db.query('SELECT * FROM whatsapp_groups ORDER BY created_at DESC');
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
};

const createGroup = async (req, res) => {
  try {
    const { group_name, link } = req.body;
    if (!group_name || !link) return res.status(400).json({ message: 'Group name and link are required' });

    const [result] = await db.query(
      'INSERT INTO whatsapp_groups (group_name, link) VALUES (?, ?)',
      [group_name, link]
    );

    res.status(201).json({ message: 'Group created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating group' });
  }
};

const assignStudentToGroup = async (req, res) => {
  try {
    const { user_id, group_id } = req.body;
    if (!user_id || !group_id) return res.status(400).json({ message: 'user_id and group_id are required' });
    
    const [result] = await db.query(
      'INSERT INTO student_groups (user_id, group_id) VALUES (?, ?)',
      [user_id, group_id]
    );

    res.status(201).json({ message: 'Student assigned to group' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error assigning student to group' });
  }
};

const getStudentGroup = async (req, res) => {
  try {
    const { id } = req.params; // this is user_id
    const [result] = await db.query(
      `SELECT wg.* FROM whatsapp_groups wg 
       INNER JOIN student_groups sg ON wg.id = sg.group_id 
       WHERE sg.user_id = ?`,
       [id]
    );
    
    // Send array of groups or single if business rules specify 1 group per student
    res.status(200).json(result); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching student group' });
  }
};

module.exports = {
  getStudyModels,
  createStudyModel,
  getEvents,
  createEvent,
  getGroups,
  createGroup,
  assignStudentToGroup,
  getStudentGroup
};
