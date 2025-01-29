const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/invoice.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const invoiceValidator = require('../validations/invoice.validation');

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
    validateRequest(invoiceValidator.fetchStockSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.fetchStock
);

// Invoice create route
router.post(
    '/create',
    authMiddleware,
    validateRequest(invoiceValidator.createInvoiceSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.createInvoice
);

// Invoice detail route
router.post(
    '/detail',
    authMiddleware,
    validateRequest(invoiceValidator.invoiceDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.invoiceDetail
);

// Invoice delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(invoiceValidator.invoiceDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.invoiceDelete
);

// Invoice detail route
router.post(
    '/update',
    authMiddleware,
    validateRequest(invoiceValidator.invoiceUpdateSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.invoiceUpdate
);

// Fetch all invoice route
router.post(
    '/all-invoice',
    authMiddleware,
    validateRequest(invoiceValidator.allInvoiceSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.allInvoice
);

// Change invoice payment status route
router.post(
    '/change-status',
    authMiddleware,
    validateRequest(invoiceValidator.changeStatusSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.changeStatus
);

// Fetch all invoice route
router.post(
    '/mail-invoice',
    authMiddleware,
    // validateRequest(invoiceValidator.sendInvoiceMail),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    invoiceController.sendInvoiceMail
);

module.exports = router;