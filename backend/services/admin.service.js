const nodemailer = require("nodemailer");
const Admin = require("../model/admin");


// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // Disable SSL certificate verification
    }
  });
  
// Function to send reset email
  const sendResetEmail = async (to, resetLink) => {
    try {
      // Send mail with defined transport object
      await transporter.sendMail({
        from: process.env.SMPT_MAIL,
        to: to,
        subject: "Password Reset Request",
        html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px;">
        <p>Hello,</p>
        <p style="margin-bottom: 20px;">You requested a password reset for your account.</p>
        <p style="margin-bottom: 20px;">Please click the following link to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #124E78; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
        <p>Thanks,</p>
      </div>
        `,
      });
      console.log("Reset email sent successfully");
    } catch (error) {
      console.error("Error sending reset email:", error);
      throw new Error("Failed to send reset email");
    }
  };
  const getAdminByEmail = async (email) => {
      try {
        // Find and return the admin user by email
        return await Admin.findOne({ email });
      } catch (error) {
        throw new Error('Error finding admin user by email');
      }
  };



module.exports = {sendResetEmail,getAdminByEmail };