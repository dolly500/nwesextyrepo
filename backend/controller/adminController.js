const Admin = require("../model/admin");
const {
    adminRegistrationSchema,
    adminLoginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require("../validators/adminAuth");
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require("../utils/jwtToken");
const { sendResetEmail, getAdminByEmail } = require('../services/admin.service');

//const catchAsync = require('express-async-handler');
const adminService = require('../services/admin.service');

const signupAdmin = async (req, res) => {
  try {
    const {shopName,phoneNumber, email, addresses,zipCode, password, avatar} = req.body;

    // Validate user input
    const { error } = adminRegistrationSchema.validate({shopName,phoneNumber, email, addresses,zipCode, password, avatar});
    if (error) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.details[0].message,
      });
    }
    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Admin User already exists",
      });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const admin = new Admin({
      shopName,
      phoneNumber,
      email,
      addresses,
      zipCode,
      password: hashedPassword,
      avatar
      
    });

    // Save the user to the database
    await admin.save();

    res.status(201).json({
      success: true,
      data: admin,
      message: "Admin User registration successful 🚀",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      data: null,
      error: err.message,
      message: " Admin User registration failed",
    });
  }
};
const signInAdmin = async (req, res) => {
  try {
    const {email,password } = req.body;

    // Validate user input
    const { error } = adminLoginSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.details[0].message,
      });
    }

    // Find the user by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error('Admin User not found');
    }

    // Compare the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate the access token
    const accessToken = generateAccessToken(admin);

    // Send both tokens in the response
    res.status(200).json({
      success: true,
      data: { admin, accessToken },
      error: null,
      message: "Welcome 😎",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: null,
      error: err.message,
      message: null,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Validate the request body
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the admin user exists
    const { email } = req.body;
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: ' Admin User with this email does not exist' });
    }

    // Generate a reset token
    const resetToken = generateAccessToken(admin);

    // Save the reset token to the admin user object
    admin.resetToken = resetToken;
    await admin.save();

    // Send the reset link to the admin user's email
    const resetLink = `https://nwesextyrepo-apis.onrender.com
    /api/v1/auth/reset-password?token=${resetToken}`;
    await sendResetEmail(admin.email, resetLink);

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }

};
// Controller for user logout
const logoutUser = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      data: null,
      message: "Logged out successfully!📌",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: null,
      error: err.message,
      message: null,
    });
  }
};

const resetPassword = async (req, res) => {
  try {

    // Validate the request body
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, newPassword,} = req.body;
    // Find the admin user by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password Changed ✔, Your Password has been successfully changed👌' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};


module.exports = { 
  signupAdmin,
  signInAdmin,
  logoutUser,
  forgotPassword,
  resetPassword,

};
