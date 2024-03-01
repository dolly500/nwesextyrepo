// validation.js
const Joi = require("joi");



// Define Joi schema for the avatar object
const avatarSchema = Joi.object({
  public_id: Joi.string().required(),
  url: Joi.string().required(),
});
// Joi schema for user registration
const adminRegistrationSchema = Joi.object({
  shopName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  addresses: Joi.string().required(),
  zipCode: Joi.string().required(),
  password: Joi.string().required(),
  avatar: avatarSchema.required(),
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
