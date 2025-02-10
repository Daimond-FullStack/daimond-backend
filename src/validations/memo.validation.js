const Joi = require('joi');

const memoItemSchema = Joi.object({
  _id: Joi.string().optional(),
  refNo: Joi.string().required(),
  description: Joi.string().allow(''),
  carat: Joi.string().required(),
  pricePerCarat: Joi.string().required(),
  returnInCarats: Joi.string().allow(''),
  soldInCarats: Joi.string().allow(''),
  price: Joi.string().required(),
  remarks: Joi.string().allow('')
});

const existingItemSchema = Joi.object({
  _id: Joi.string().optional(),
  stockId: Joi.string().allow(null),
  refNo: Joi.string().required(),
  description: Joi.string().allow(''),
  carat: Joi.string().required(),
  pricePerCarat: Joi.string().required(),
  returnInCarats: Joi.string().allow(''),
  soldInCarats: Joi.string().allow(''),
  price: Joi.string().required(),
  remarks: Joi.string().allow('')
});

const createMemoSchema = Joi.object({
  customer: Joi.string().required(),
  items: Joi.array().items(memoItemSchema).min(1).required()
});

const memoDetailSchema = Joi.object({
  memoId: Joi.string().required()
});

const memoUpdateSchema = Joi.object({
  memoId: Joi.string().required(),
  customer: Joi.string().required(),
  items: Joi.array().items(existingItemSchema).min(1).required(),
  removedItems: Joi.array().items(Joi.string()).allow()
});

const allMemoSchema = Joi.object({
  sortingKey: Joi.string().allow(''),
  sortingOrder: Joi.string().allow(''),
  page: Joi.number().default(1),
  limit: Joi.number().default(10)
});

module.exports = {
  createMemoSchema,
  memoDetailSchema,
  memoUpdateSchema,
  allMemoSchema
};