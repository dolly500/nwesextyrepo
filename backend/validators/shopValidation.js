const Joi = require('joi');

// Validation schema for creating a shop
const createShopSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  zipCode: Joi.string().required(),
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

module.exports = {
  createShopSchema,
  activationSchema,
  loginSchema,
  updateShopAvatarSchema,
  updateSellerInfoSchema,
};
