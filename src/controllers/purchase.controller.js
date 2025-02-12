const purchaseService = require('../services/purchase.service');

const { successResponse, errorResponse } = require('../utils/responses');

const uploadDaimondImages = async (req, res) => {
    try {
        const daimond = await purchaseService.upload(req, res);

        if (!daimond) return;

        return successResponse(res, daimond, 'Daimond images uploaded successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const removeDaimondImages = async (req, res) => {
    try {
        const daimond = await purchaseService.remove(req, res);

        if (!daimond) return;

        return successResponse(res, daimond, 'Daimond images removed successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const addNewPurchase = async (req, res) => {
    try {
        const purchase = await purchaseService.addNew(req, res);

        if (!purchase) return;

        return successResponse(res, purchase, 'New purchase item added successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const purchaseDetail = async (req, res) => {
    try {
        const purchase = await purchaseService.detail(req, res);

        if (!purchase) return;

        return successResponse(res, purchase, 'Purchase detail fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const purchaseDelete = async (req, res) => {
    try {
        const purchase = await purchaseService.deletation(req, res);

        if (!purchase) return;

        return successResponse(res, purchase, 'Purchase deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const purchaseUpdate = async (req, res) => {
    try {
        const purchase = await purchaseService.edit(req, res);

        if (!purchase) return;

        return successResponse(res, stock, 'Purchase updated successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allPurchases = async (req, res) => {
    try {
        const purchases = await purchaseService.all(req, res);

        if (!purchases) return;

        return successResponse(res, purchases, 'Purchase fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    uploadDaimondImages,
    removeDaimondImages,
    addNewPurchase,
    purchaseDetail,
    purchaseDelete,
    purchaseUpdate,
    allPurchases
};