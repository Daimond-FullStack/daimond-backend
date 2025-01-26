const express = require('express');
const router = express.Router();

const memoController = require('../controllers/memo.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const { fetchStockSchema, createMemoSchema, memoDetailSchema, memoUpdateSchema, allMemoSchema } = require('../validations/memo.validation');

// All Customer List route
router.get(
    '/all-customer',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.allCustomer
);

// Find RefNo Throw Stock route
router.post(
    '/fetch-stock',
    authMiddleware,
    validateRequest(fetchStockSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.fetchStock
);

// Memo create route
router.post(
    '/create',
    authMiddleware,
    validateRequest(createMemoSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.createMemo
);

// Memo detail route
router.post(
    '/detail',
    authMiddleware,
    validateRequest(memoDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.memoDetail
);

// Memo delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(memoDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.memoDelete
);

// Memo detail route
router.post(
    '/update',
    authMiddleware,
    validateRequest(memoUpdateSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.memoUpdate
);

// Fetch all memo route
router.post(
    '/all-memo',
    authMiddleware,
    validateRequest(allMemoSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    memoController.allMemo
);

module.exports = router;