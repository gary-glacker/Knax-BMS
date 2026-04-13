const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Header token
const generateToken = (id, role_id) => {
  return jwt.sign({ id, role_id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//    Register New User
//    POST /api/users/signup
const CreateNewUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        message: "Please enter all fields (name, email, password, role_id)",
      });
    }

    // Check if user exists
    const [existingUsers] = await db.query(
      "SELECT * FROM `users` WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const query =
      "INSERT INTO `users`(`name`, `email`, `password`, `role_id`) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [
      name,
      email,
      hashedPassword,
      role_id,
    ]);

    if (result.affectedRows === 1) {
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: result.insertId,
          name,
          email,
          role_id,
        },
        token: generateToken(result.insertId, role_id),
      });
    } else {
      res.status(500).json({ message: "Invalid user data during insertion" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Login user on the system
//    POST /api/users/login
const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter your email and password" });
    }

    const [users] = await db.query("SELECT * FROM `users` WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Compare password with hashed DB password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
        },
        token: generateToken(user.id, user.role_id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Get All Users
//    GET /api/users
const GetAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role_id, created_at FROM `users`",
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//    Update user by Id
//    PUT /api/users/:id
const UserUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !role_id) {
      return res
        .status(400)
        .json({ message: "Form Invalid! name, email, role_id are required" });
    }

    // Check user existence
    const [users] = await db.query("SELECT * FROM `users` WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let queryUpdate = "";
    let queryParams = [];

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      queryUpdate =
        "UPDATE `users` SET `name`=?, `email`=?, `role_id`=?, `password`=? WHERE `id`=?";
      queryParams = [name, email, role_id, hashedPassword, id];
    } else {
      queryUpdate =
        "UPDATE `users` SET `name`=?, `email`=?, `role_id`=? WHERE `id`=?";
      queryParams = [name, email, role_id, id];
    }

    const [result] = await db.query(queryUpdate, queryParams);

    if (result.affectedRows === 1) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(400).json({ message: "User update failed" });
    }
  } catch (error) {
    console.error("data not updated", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/users/:id
const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM `users` WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!",
      });
    }

    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // IMPORTANT: Always return same response even if email doesn't exist
    // This prevents email enumeration attacks
    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, a reset code has been sent.",
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
      [resetCode, expiresAt, user.id],
    );

    // TODO: Send email with reset code
    // await sendResetCodeEmail(email, resetCode);

    // In development, you can return the code for testing
    if (process.env.NODE_ENV === "development") {
      return res.status(200).json({
        success: true,
        message: "Reset code generated successfully",
        debug: { resetCode }, // Remove in production
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists for this email, a reset code has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Validate input
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset code, and new password are required",
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Find user with matching email and valid reset code
    const [users] = await db.query(
      `SELECT * FROM users 
       WHERE email = ? 
       AND resetPasswordCode = ? 
       AND resetPasswordExpires > NOW()`,
      [email, code],
    );

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code. Please request a new one.",
      });
    }

    const user = users[0];

    // Hash the new password (using bcrypt recommended)
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset code fields
    await db.query(
      `UPDATE users 
       SET password = ?, 
           resetPasswordCode = NULL, 
           resetPasswordExpires = NULL 
       WHERE id = ?`,
      [hashedPassword, user.id],
    );

    // Optional: Send confirmation email
    // await sendPasswordChangedEmail(email);

    return res.status(200).json({
      success: true,
      message:
        "Password has been reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// VERIFY RESET CODE (Optional - for multi-step process)
const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and reset code are required",
      });
    }

    const [users] = await db.query(
      `SELECT * FROM users 
       WHERE email = ? 
       AND resetPasswordCode = ? 
       AND resetPasswordExpires > NOW()`,
      [email, code],
    );

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset code is valid",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  CreateNewUser,
  UserLogin,
  GetAllUsers,
  UserUpdate,
  DeleteUser,
};
