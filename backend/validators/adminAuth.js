// validation.js
const Joi = require("joi");

// Joi schema for user registration
const adminRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});



const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


// Joi schema for forgot password
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Joi schema for reset password
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().required()

});



module.exports = {
  adminRegistrationSchema,
  adminLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
