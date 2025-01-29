const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { upload } = require('../middleware/multer.middleware');

const stockValidator = require('../validations/stock.validation');

// All Vendor List route
router.get(
    '/all-vendors',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.allVendorsList
);

// Upload Image route
router.post(
    '/upload-image',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    upload.array('DaimondPic', 10),
    stockController.uploadDaimondImages
);

// Remove Image route
router.post(
    '/remove-image',
    authMiddleware,
    validateRequest(stockValidator.removeImageSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.removeDaimondImages
);

// Stock creation route
router.post(
    '/add-new',
    authMiddleware,
    validateRequest(stockValidator.addNewStockSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.addNewStock
);

// Stock detail route
router.post(
    '/detail',
    authMiddleware,
    validateRequest(stockValidator.stockDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.stockDetail
);

// Stock delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(stockValidator.stockDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.stockDelete
);

// Stock update route
router.post(
    '/update',
    authMiddleware,
    validateRequest(stockValidator.updateStockDetailSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.stockUpdate
);

// All stock items list route
router.post(
    '/all-stocks',
    authMiddleware,
    validateRequest(stockValidator.allStocksSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.allStocks
);

// Stock creation via excel file route
router.post(
    '/import-excel',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    upload.single('StockExcel'),
    stockController.importStockViaExcel
);

// Export stock data via excel file route
router.post(
    '/export-excel',
    authMiddleware,
    validateRequest(stockValidator.allStocksSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    stockController.exportStockExcel
);

module.exports = router;