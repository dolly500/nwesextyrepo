const Joi = require('joi');

// Validation schema for creating a shop
const createShopSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().required(),
});

// Validation schema for activation
const activationSchema = Joi.object({
  activation_token: Joi.string().required(),
});

// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Validation schema for update shop avatar
const updateShopAvatarSchema = Joi.object({
  avatar: Joi.string().required(),
});

// Validation schema for updating seller info
const updateSellerInfoSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  zipCode: Joi.string().required(),
});

// Joi schema for forgot password
const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

// Joi schema for reset password
const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    resetToken: Joi.string().required(),
    newPassword: Joi.string().required(),
  });
  
const verifyEmailRequestSchema = Joi.object({
    token: Joi.string().required(),
});


module.exports = {
  createShopSchema,
  activationSchema,
  loginSchema,
  updateShopAvatarSchema,
  updateSellerInfoSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailRequestSchema
};
