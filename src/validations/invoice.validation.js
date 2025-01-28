const Joi = require('joi');

const fetchStockSchema = Joi.object({
  refNo: Joi.string().allow("").required()
});

const invoiceItemSchema = Joi.object({
  refNo: Joi.string().required(),
  description: Joi.string().allow(''),
  carats: Joi.string().required(),
  pricePerCarat: Joi.string().required(),
  returnInCarats: Joi.string().allow(''),
  soldInCarats: Joi.string().allow(''),
  price: Joi.string().required(),
  remarks: Joi.string().allow('')
});

const existingItemSchema = Joi.object({
  _id: Joi.string().required(),
  refNo: Joi.string().required(),
  description: Joi.string().allow(''),
  carats: Joi.string().required(),
  pricePerCarat: Joi.string().required(),
  returnInCarats: Joi.string().allow(''),
  soldInCarats: Joi.string().allow(''),
  price: Joi.string().required(),
  remarks: Joi.string().allow('')
});

const createInvoiceSchema = Joi.object({
  customer: Joi.string().required(),
  items: Joi.array().items(invoiceItemSchema).min(1).required()
});

const invoiceDetailSchema = Joi.object({
  sellInvoiceId: Joi.string().required()
});

const invoiceUpdateSchema = Joi.object({
  sellInvoiceId: Joi.string().required(),
  customer: Joi.string().required(),
  newItems: Joi.array().items(invoiceItemSchema).allow(),
  removedItems: Joi.array().items(Joi.string()).allow(),
  updatedItems: Joi.array().items(existingItemSchema).allow()
});

const allInvoiceSchema = Joi.object({
  search: Joi.string().allow(''),
  sortingKey: Joi.string().allow(''),
  sortingOrder: Joi.string().allow(''),
  page: Joi.number().default(1),
  limit: Joi.number().default(10)
});

module.exports = {
  fetchStockSchema,
  createInvoiceSchema,
  invoiceDetailSchema,
  invoiceUpdateSchema,
  allInvoiceSchema
};