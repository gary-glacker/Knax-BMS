// config/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with connection pooling for better performance [citation:1]
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // false for 587, true for 465
  pool: true,    // Enable connection pooling
  maxConnections: 5,  // Maintain up to 5 open connections
  maxMessages: 100,  
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

module.exports = transporter;