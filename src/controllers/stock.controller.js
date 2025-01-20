const stockService = require('../services/stock.service');

const { successResponse, errorResponse } = require('../utils/responses');

const allVendorsList = async (req, res) => {
    try {
        const vendors = await stockService.list(req, res);

        if (!vendors) return;

        return successResponse(res, vendors, 'Customer fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const uploadDaimondImages = async (req, res) => {
    try {
        const daimond = await stockService.upload(req, res);

        if (!daimond) return;

        return successResponse(res, daimond, 'Daimond images uploaded successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const removeDaimondImages = async (req, res) => {
    try {
        const daimond = await stockService.remove(req, res);

        if (!daimond) return;

        return successResponse(res, daimond, 'Daimond images removed successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const addNewStock = async (req, res) => {
    try {
        const stock = await stockService.addNew(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'New stock item added successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const stockDetail = async (req, res) => {
    try {
        const stock = await stockService.detail(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'Stock detail fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const stockDelete = async (req, res) => {
    try {
        const stock = await stockService.deletation(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'Stock deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const stockUpdate = async (req, res) => {
    try {
        const stock = await stockService.edit(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'Stock updated successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allStocks = async (req, res) => {
    try {
        const stocks = await stockService.all(req, res);

        if (!stocks) return;

        return successResponse(res, stocks, 'Stock fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const importStockViaExcel = async (req, res) => {
    try {
        const stocks = await stockService.importExcel(req, res);

        if (!stocks) return;

        return successResponse(res, stocks, 'Excel uploaded successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    allVendorsList,
    uploadDaimondImages,
    removeDaimondImages,
    addNewStock,
    stockDetail,
    stockDelete,
    stockUpdate,
    allStocks,
    importStockViaExcel
};