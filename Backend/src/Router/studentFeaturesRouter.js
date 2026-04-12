const express = require('express');
const router = express.Router();
const studentFeaturesController = require('../controller/studentFeaturesController');

// Study Models
router.get('/study-models', studentFeaturesController.getStudyModels);
router.post('/study-models', studentFeaturesController.createStudyModel);

// Events
router.get('/events', studentFeaturesController.getEvents);
router.post('/events', studentFeaturesController.createEvent);

// WhatsApp Groups
router.get('/whatsapp-groups', studentFeaturesController.getGroups);
router.post('/whatsapp-groups', studentFeaturesController.createGroup);

// Student Group Assignments
router.post('/student-groups', studentFeaturesController.assignStudentToGroup);
router.get('/student-groups/:id', studentFeaturesController.getStudentGroup); // user_id

module.exports = router;
