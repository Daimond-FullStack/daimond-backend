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
    location: Joi.string().min(1).max(255).required(),
    shape: Joi.string().min(1).max(50).required(),
    color: Joi.string().min(1).max(50).allow(''),
    clarity: Joi.string().min(1).max(50).allow(''),
    pic: Joi.string().default(1),
    remarks: Joi.string().min(1).max(500).allow(''),
    cost: Joi.string().allow(''),
    costPerCarat: Joi.string().allow(''),
    pricePerCarat: Joi.string().allow(''),
    price: Joi.string().allow(''),
    size: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    polish: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    symmetry: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    fl: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    depth: Joi.string().when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    table: Joi.string().when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    measurement: Joi.object({
        length: Joi.string().allow(''),
        width: Joi.string().allow(''),
        height: Joi.string().allow(''),
    }).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    ratio: Joi.string().when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    cartId: Joi.string().min(1).max(255).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    certificateNo: Joi.string().min(1).max(255).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    diamondImages: Joi.array().items(Joi.string()).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    })
});

const stockDetailSchema = Joi.object({
    stockId: Joi.string().required()
});

const updateStockDetailSchema = Joi.object({
    stockId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(CONSTANT.STOCK_TYPE)).required(),
    diamondName: Joi.string().min(1).max(255).required(),
    refNo: Joi.string().min(1).max(255).required(),
    carat: Joi.string().required(),
    location: Joi.string().min(1).max(255).required(),
    shape: Joi.string().min(1).max(50).required(),
    color: Joi.string().min(1).max(50).allow(''),
    clarity: Joi.string().min(1).max(50).allow(''),
    pic: Joi.string().default(1),
    remarks: Joi.string().min(1).max(500).allow(''),
    cost: Joi.string().allow(''),
    costPerCarat: Joi.string().allow(''),
    pricePerCarat: Joi.string().allow(''),
    price: Joi.string().allow(''),
    size: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    polish: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    symmetry: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    fl: Joi.string().min(1).max(50).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    depth: Joi.string().when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    table: Joi.string().when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    measurement: Joi.object({
        length: Joi.string().allow(''),
        width: Joi.string().allow(''),
        height: Joi.string().allow(''),
    }).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    ratio: Joi.string().when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    cartId: Joi.string().min(1).max(255).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    certificateNo: Joi.string().min(1).max(255).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    }),
    diamondImages: Joi.array().items(Joi.string()).when("type", {
        is: CONSTANT.STOCK_TYPE.GIA_STONE,
        then: Joi.allow(''),
        otherwise: Joi.forbidden(),
    })
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