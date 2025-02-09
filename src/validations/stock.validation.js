const Joi = require('joi');
const CONSTANT = require("../utils/constant");

const removeImageSchema = Joi.object({
    url: Joi.array().items(Joi.string()).min(1).required()
});

const addNewStockSchema = Joi.object({
    type: Joi.string().valid(...Object.values(CONSTANT.STOCK_TYPE)).required(),
    diamondName: Joi.string().min(1).max(255).required(),
    refNo: Joi.string().min(1).max(255).required(),
    carat: Joi.string().required(),
    location: Joi.string().min(1).max(255).optional(),
    color: Joi.string().min(1).max(50).optional(),
    shape: Joi.string().min(1).max(50).optional(),
    size: Joi.string().min(1).max(50).optional(),
    clarity: Joi.string().min(1).max(50).optional(),
    polish: Joi.string().min(1).max(50).optional(),
    symmetry: Joi.string().min(1).max(50).optional(),
    fl: Joi.string().min(1).max(50).optional(),
    depth: Joi.string().optional(),
    table: Joi.string().optional(),
    measurement: Joi.object({
        length: Joi.string().optional(),
        width: Joi.string().optional(),
        height: Joi.string().optional(),
    }).optional(),
    ratio: Joi.string().optional(),
    cartId: Joi.string().min(1).max(255).optional(),
    certificateNo: Joi.string().min(1).max(255).optional(),
    diamondImages: Joi.array().items(Joi.string()).optional(),
    remarks: Joi.string().min(1).max(500).allow(''),
    cost: Joi.string().optional(),
    costPerCarat: Joi.string().optional(),
    pricePerCarat: Joi.string().optional(),
    price: Joi.string().optional()
});

const stockDetailSchema = Joi.object({
    stockId: Joi.string().required()
});

const updateStockDetailSchema = Joi.object({
    stockId: Joi.string().required(),
    diamondName: Joi.string().min(1).max(255).required(),
    refNo: Joi.string().min(1).max(255).required(),
    location: Joi.string().min(1).max(255).required(),
    carat: Joi.string().required(),
    color: Joi.string().min(1).max(50).required(),
    shape: Joi.string().min(1).max(50).required(),
    size: Joi.string().min(1).max(50).required(),
    clarity: Joi.string().min(1).max(50).required(),
    polish: Joi.string().min(1).max(50).required(),
    symmetry: Joi.string().min(1).max(50).required(),
    fl: Joi.string().min(1).max(50).required(),
    depth: Joi.string().required(),
    table: Joi.string().required(),
    measurement: Joi.object({
        length: Joi.string().required(),
        width: Joi.string().required(),
        height: Joi.string().required(),
    }).required(),
    ratio: Joi.string().required(),
    cartId: Joi.string().min(1).max(255).required(),
    certificateNo: Joi.string().min(1).max(255).required(),
    diamondImages: Joi.array().items(Joi.string()).optional(),
    remarks: Joi.string().min(1).max(500).allow(''),
    pricePerCarat: Joi.string().required(),
    price: Joi.string().required()
});

const allStocksSchema = Joi.object({
    search: Joi.string().allow(''),
    sortingKey: Joi.string().allow(''),
    sortingOrder: Joi.string().allow(''),
    page: Joi.number().default(1),
    limit: Joi.number().default(10)
});

module.exports = {
    removeImageSchema,
    addNewStockSchema,
    stockDetailSchema,
    updateStockDetailSchema,
    allStocksSchema
};