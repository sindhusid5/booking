// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/userModel');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();
const autenticate = require('../handler/autenticate');


// Login and generate a JWT token
router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });

    if (!user) {
      return res.json({
        status: "failure",
        message: 'user not found. Register first.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({
        status: "failure",
        message: 'Invalid Credential.'
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to delete a user by userId
router.delete('/users/:userId',autenticate, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete the user from the database
    await users.findByIdAndDelete(userId);

    res.json({ success: true, message: 'User deleted successfully', data: user });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// Route to deactivate a user
router.put('/users/update/:userId', autenticate,async (req, res) => {
  try {
    const userId = req.params.userId;
    const { isActive } = req.body;

    // Check if the user exists
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update the isActive field
    user.isActive = isActive;

    // Save the updated user to the database
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: `User deactivated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});



//forget password
router.post('/forgetPassword', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user with the provided email exists
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate a unique token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send an email with the reset password link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


//user logout
router.post('/users/logout', autenticate, (req, res) => {
  // Check if the Authorization header is present
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  // Return a successful response
  return res.json({ message: 'User logged out successfully' });
});


module.exports = router;  