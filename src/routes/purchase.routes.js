const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { upload } = require('../middleware/multer.middleware');

const purchaseValidator = require('../validations/purchase.validation');

// Upload Image route
router.post(
    '/upload-image',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    upload.array('DaimondPic', 10),
    purchaseController.uploadDaimondImages
);

// Remove Image route
router.post(
    '/remove-image',
    authMiddleware,
    validateRequest(purchaseValidator.removeImageSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    purchaseController.removeDaimondImages
);

// Stock creation route
router.post(
    '/add-new',
    authMiddleware,
    validateRequest(purchaseValidator.addNewStockSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    purchaseController.addNewPurchase
);

// Stock detail route
router.post(
    '/detail',
    authMiddleware,
    validateRequest(purchaseValidator.stockDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    purchaseController.purchaseDetail
);

// Stock delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(purchaseValidator.stockDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    purchaseController.purchaseDelete
);

// Stock update route
router.post(
    '/update',
    authMiddleware,
    validateRequest(purchaseValidator.updateStockDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    purchaseController.purchaseUpdate
);

// All stock items list route
router.post(
    '/all-purchases',
    authMiddleware,
    validateRequest(purchaseValidator.allStocksSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    purchaseController.allPurchases
);

module.exports = router;