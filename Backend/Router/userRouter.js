const express = require('express');
const router = express.Router();
const { CreateNewUser } = require("../controller/userController");

// Get all users
router.get("/user",)

//create new user
 router.post("/user", CreateNewUser);



 module.exports = router;