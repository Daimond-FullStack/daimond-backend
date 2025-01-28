const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/invoice.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const { fetchStockSchema, createInvoiceSchema, invoiceDetailSchema, invoiceUpdateSchema, allInvoiceSchema } = require('../validations/invoice.validation');

// All Customer List route
router.get(
    '/all-customer',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.allCustomer
);

// Find RefNo Throw Stock route
router.post(
    '/fetch-stock',
    authMiddleware,
    validateRequest(fetchStockSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.fetchStock
);

// Invoice create route
router.post(
    '/create',
    authMiddleware,
    validateRequest(createInvoiceSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.createInvoice
);

// Invoice detail route
router.post(
    '/detail',
    authMiddleware,
    validateRequest(invoiceDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.invoiceDetail
);

// Invoice delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(invoiceDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.invoiceDelete
);

// Invoice detail route
router.post(
    '/update',
    authMiddleware,
    validateRequest(invoiceUpdateSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.invoiceUpdate
);

// Fetch all invoice route
router.post(
    '/all-invoice',
    authMiddleware,
    validateRequest(allInvoiceSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.allInvoice
);

module.exports = router;