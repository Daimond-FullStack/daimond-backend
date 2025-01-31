const Joi = require('joi');
const CONSTANT = require('../utils/constant');

const addExpenseSchema = Joi.object({
  category: Joi.string().valid(...Object.values(CONSTANT.EXPENSE_CATEGORY)).required(),
  invoiceNumber: Joi.string().required(),
  amount: Joi.string().required(),
  expenseDate: Joi.date().required(),
  description: Joi.string().allow(''),
});

const detailExpenseSchema = Joi.object({
  expenseId: Joi.string().required()
});

const editExpenseSchema = Joi.object({
  expenseId: Joi.string().required(),
  category: Joi.string().valid(...Object.values(CONSTANT.EXPENSE_CATEGORY)).allow(''),
  invoiceNumber: Joi.string().allow(''),
  amount: Joi.string().allow(''),
  expenseDate: Joi.date().allow(''),
  description: Joi.string().allow(''),
});

const deleteExpenseSchema = Joi.object({
  expenseId: Joi.string().required()
});

const allExpenseSchema = Joi.object({
  sortingKey: Joi.string().allow(''),
  sortingOrder: Joi.string().allow(''),
  page: Joi.number().default(1),
  limit: Joi.number().default(10)
});

module.exports = {
  addExpenseSchema,
  detailExpenseSchema,
  editExpenseSchema,
  deleteExpenseSchema,
  allExpenseSchema
};