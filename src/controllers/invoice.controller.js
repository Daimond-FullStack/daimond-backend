const invoiceService = require('../services/invoice.service');

const { successResponse, errorResponse } = require('../utils/responses');

const allCustomer = async (req, res) => {
    try {
        const customer = await invoiceService.list(req, res);

        if (!customer) return;

        return successResponse(res, customer, 'Customer fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const fetchStock = async (req, res) => {
    try {
        const stock = await invoiceService.fetch(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'Stock fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const createInvoice = async (req, res) => {
    try {
        const memo = await invoiceService.creation(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Invoice created successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const invoiceDetail = async (req, res) => {
    try {
        const memo = await invoiceService.detail(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Invoice detail fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const invoiceDelete = async (req, res) => {
    try {
        const memo = await invoiceService.deletation(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Invoice deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const invoiceUpdate = async (req, res) => {
    try {
        const memo = await invoiceService.edit(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Invoice updated successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allInvoice = async (req, res) => {
    try {
        const memo = await invoiceService.all(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Invoice list fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const changeStatus = async (req, res) => {
    try {
        const memo = await invoiceService.status(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Invoice marked as paid successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const sendInvoiceMail = async (req, res) => {
    try {
        const memo = await invoiceService.status(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Invoice marked as paid successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    allCustomer,
    fetchStock,
    createInvoice,
    invoiceDetail,
    invoiceDelete,
    invoiceUpdate,
    allInvoice,
    changeStatus,
    sendInvoiceMail
};