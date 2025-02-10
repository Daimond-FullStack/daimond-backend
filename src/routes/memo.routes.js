const express = require('express');
const router = express.Router();

const memoController = require('../controllers/memo.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const memoValidator = require('../validations/memo.validation');

// All Customer List route
router.get(
    '/all-customer',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.allCustomer
);

// Find RefNo Throw Stock route
router.get(
    '/fetch-stock-list',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.fetchStockList
);

// Memo create route
router.post(
    '/create',
    authMiddleware,
    validateRequest(memoValidator.createMemoSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.createMemo
);

// Memo detail route
router.post(
    '/detail',
    authMiddleware,
    validateRequest(memoValidator.memoDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.memoDetail
);

// Memo delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(memoValidator.memoDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.memoDelete
);

// Memo detail route
router.post(
    '/update',
    authMiddleware,
    validateRequest(memoValidator.memoUpdateSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.memoUpdate
);

// Fetch all memo route
router.post(
    '/all-memo',
    authMiddleware,
    validateRequest(memoValidator.allMemoSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.allMemo
);

module.exports = router;