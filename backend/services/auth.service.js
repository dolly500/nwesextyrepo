const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');




const hashFunction = async (data) => {
  const saltRounds = 10; // Number of salt rounds
  return bcrypt.hash(data, saltRounds);
};
// Use the transporter to send emails
const sendResetTokenByEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // do not verify the certificate
      }
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject: "Password Reset",
      text: `Here is your password reset Password: ${resetToken}\n\nPlease copy this token and use it in the password reset form on our website.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const generateResetToken = async () => {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const hash = await hashFunction(token);
  return { token, hash };
};



const validateResetToken = (savedTokenHash, inputToken) => {
  return bcrypt.compareSync(inputToken, savedTokenHash);
};


module.exports = { sendResetTokenByEmail,generateResetToken,validateResetToken};