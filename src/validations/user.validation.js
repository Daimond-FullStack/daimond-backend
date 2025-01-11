const Joi = require('joi');
const { ROLES_AND_PERMISSION } = require('../utils/constant');

const removeImageSchema = Joi.object({
  url: Joi.string().required()
});

const registrationSchema = Joi.object({
  userType: Joi.string().valid(...Object.values(ROLES_AND_PERMISSION)).required(),
  profilePic: Joi.string().allow(''),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateStatusSchema = Joi.object({
  userId: Joi.string().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  loginIp: Joi.string().required(),
  loginSystemKey: Joi.string().required()
});

const requestResetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  userId: Joi.string().required(),
  token: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

const deleteUserSchema = Joi.object({
  userId: Joi.string().required()
});

const allUserSchema = Joi.object({
  search: Joi.string().allow(''),
  sortingKey: Joi.string().allow(''),
  sortingOrder: Joi.string().allow(''),
  page: Joi.number().default(1),
  limit: Joi.number().default(10)
});

module.exports = {
  removeImageSchema,
  registrationSchema,
  updateStatusSchema,
  loginSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
  deleteUserSchema,
  allUserSchema
};