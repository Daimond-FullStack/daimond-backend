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

module.exports = {
    allVendorsList
};