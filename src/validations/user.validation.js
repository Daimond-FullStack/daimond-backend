const Joi = require('joi');

const registrationSchema = Joi.object({
  userType: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
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

module.exports = {
  registrationSchema,
  updateStatusSchema,
  loginSchema,
  requestResetPasswordSchema,
  resetPasswordSchema
};