const Joi = require('joi');
const { CUSTOMER } = require('../utils/constant');

const addCustomerSchema = Joi.object({
  userType: Joi.string().valid(...Object.values(CUSTOMER)).required(),
  name: Joi.string().required(),
  company: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().allow(''),
  address: Joi.string().required()
});

const deleteCustomerSchema = Joi.object({
  userId: Joi.string().required()
});

const allCustomerSchema = Joi.object({
  userType: Joi.string().valid(...Object.values(CUSTOMER)).required(),
  search: Joi.string().allow(''),
  sortingKey: Joi.string().allow(''),
  sortingOrder: Joi.string().allow(''),
  page: Joi.number().default(1),
  limit: Joi.number().default(10)
});

module.exports = {
  addCustomerSchema,
  deleteCustomerSchema,
  allCustomerSchema
};