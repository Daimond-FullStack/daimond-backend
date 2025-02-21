const stockService = require('../services/stock.service');

const { successResponse, errorResponse } = require('../utils/responses');

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

const stockHistory = async (req, res) => {
    try {
        const stock = await stockService.history(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'Stock history fetched successfully.', 200);
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

        return successResponse(res, stocks, 'Excel imported successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const exportStockExcel = async (req, res) => {
    try {
        const stocks = await stockService.exportExcel(req, res);

        if (!stocks) return;

        return successResponse(res, stocks, 'Excel exported successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    uploadDaimondImages,
    removeDaimondImages,
    addNewStock,
    stockDetail,
    stockHistory,
    stockDelete,
    stockUpdate,
    allStocks,
    importStockViaExcel,
    exportStockExcel
};