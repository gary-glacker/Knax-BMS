// controllers/authController.js
const db = require('../config/database');
const { sendPasswordResetEmail } = require('../services/emailService');
const bcrypt = require('bcrypt');

// FORGOT PASSWORD - Send reset code via email
const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required!" 
      });
    }

    // Check if user exists
    const [users] = await db.query("SELECT id, name, email FROM users WHERE email = ?", [email]);
    
    // Security: Always return same response to prevent email enumeration [citation:1]
    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "If an account exists for this email, a reset code has been sent."
      });
    }

    const user = users[0];
    
    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    // Store reset code in database
    await db.query(
      "UPDATE users SET resetPasswordCode = ?, resetPasswordExpires = ? WHERE id = ?",
      [resetCode, expiresAt, user.id]
    );
    
    // Send email with reset code
    try {
      await sendPasswordResetEmail(email, resetCode, user.name);
      
      // In development, you might want to see the code for testing
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          message: "Reset code sent to your email",
          debug: { resetCode } // Remove in production!
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "If an account exists for this email, a reset code has been sent."
      });
      
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset code. Please try again later."
      });
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// VERIFY RESET CODE
const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and reset code are required"
      });
    }
    
    const [users] = await db.query(
      `SELECT * FROM users 
       WHERE email = ? 
       AND resetPasswordCode = ? 
       AND resetPasswordExpires > NOW()`,
      [email, code]
    );
    
    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code. Please request a new one."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Code verified successfully"
    });
    
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Email, reset code, and new password are required"
      });
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }
    
    // Find user with valid reset code
    const [users] = await db.query(
      `SELECT * FROM users 
       WHERE email = ? 
       AND resetPasswordCode = ? 
       AND resetPasswordExpires > NOW()`,
      [email, code]
    );
    
    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code. Please request a new one."
      });
    }
    
    const user = users[0];
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password and clear reset code fields
    await db.query(
      `UPDATE users 
       SET password = ?, 
           resetPasswordCode = NULL, 
           resetPasswordExpires = NULL 
       WHERE id = ?`,
      [hashedPassword, user.id]
    );
    
    // Send confirmation email (optional, don't await)
    const { sendPasswordChangedEmail } = require('../services/emailService');
    sendPasswordChangedEmail(email, user.name).catch(err => 
      console.error('Confirmation email failed:', err)
    );
    
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now login with your new password."
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  ForgotPassword,
  verifyResetCode,
  resetPassword,
};