const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const expenseValidator = require('../validations/expense.validation');

// Expense create route
router.post(
    '/create',
    authMiddleware,
    validateRequest(expenseValidator.addExpenseSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    expenseController.addExpense
);

// Expense detail route
router.post(
    '/detail',
    authMiddleware,
    validateRequest(expenseValidator.detailExpenseSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    expenseController.expenseDetail
);

// Expense edit route
router.post(
    '/update',
    authMiddleware,
    validateRequest(expenseValidator.editExpenseSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    expenseController.editExpense
);

// Expense delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(expenseValidator.deleteExpenseSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    expenseController.deleteExpense
);

// All expense List route
router.post(
    '/all',
    authMiddleware,
    validateRequest(expenseValidator.allExpenseSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    expenseController.allExpense
);

module.exports = router;