const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const { addCustomerSchema, deleteCustomerSchema, allCustomerSchema } = require('../validations/customer.validation');

// Customer/Vendor registration route
router.post(
    '/register',
    authMiddleware,
    validateRequest(addCustomerSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    customerController.registerCustomer
);

// Delete Customer/Vendor route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(deleteCustomerSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    customerController.deleteCustomer
);

// All Customer/Vendor List route
router.post(
    '/all-customer',
    authMiddleware,
    validateRequest(allCustomerSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    customerController.allCustomer
);

module.exports = router;