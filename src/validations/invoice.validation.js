const Joi = require('joi');

const invoiceItemSchema = Joi.object({
  _id: Joi.string().optional(),
  refNo: Joi.string().required(),
  description: Joi.string().allow(''),
  carat: Joi.string().required(),
  pricePerCarat: Joi.string().required(),
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
  price: Joi.string().required(),
  remarks: Joi.string().allow('')
});

const createInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().required(),
  customer: Joi.string().required(),
  address: Joi.string().required(),
  shipTo: Joi.string().required(),
  shippingCharge: Joi.string().allow(''),
  terms: Joi.string().required(),
  items: Joi.array().items(invoiceItemSchema).min(1).required()
});

const invoiceDetailSchema = Joi.object({
  sellInvoiceId: Joi.string().required()
});

const invoiceUpdateSchema = Joi.object({
  sellInvoiceId: Joi.string().required(),
  customer: Joi.string().required(),
  address: Joi.string().required(),
  shipTo: Joi.string().required(),
  shippingCharge: Joi.string().allow(''),
  terms: Joi.string().required(),
  items: Joi.array().items(existingItemSchema).min(1).required(),
  removedItems: Joi.array().items(Joi.string()).allow(),
});

const allInvoiceSchema = Joi.object({
  search: Joi.string().allow(''),
  sortingKey: Joi.string().allow(''),
  sortingOrder: Joi.string().allow(''),
  page: Joi.number().default(1),
  limit: Joi.number().default(10)
});

const changeStatusSchema = Joi.object({
  sellInvoiceId: Joi.string().required()
});

const downloadInvoiceSchema = Joi.object({
  sellInvoiceId: Joi.string().required()
});

module.exports = {
  createInvoiceSchema,
  invoiceDetailSchema,
  invoiceUpdateSchema,
  allInvoiceSchema,
  changeStatusSchema,
  downloadInvoiceSchema
};