const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const { } = require('../validations/stock.validation');

// All Vendor List route
router.get(
    '/all-vendors',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.allVendorsList
);

module.exports = router;