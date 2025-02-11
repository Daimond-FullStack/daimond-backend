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

const fetchStockList = async (req, res) => {
    try {
        const stock = await invoiceService.fetch(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'Stock fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const fetchInvoiceNumber = async (req, res) => {
    try {
        const invoiceNumber = await invoiceService.fetchNext(req, res);

        if (!invoiceNumber) return;

        return successResponse(res, invoiceNumber, 'Next Invoice Number fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const createInvoice = async (req, res) => {
    try {
        const invoice = await invoiceService.creation(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice created successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const invoiceDetail = async (req, res) => {
    try {
        const invoice = await invoiceService.detail(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice detail fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const invoiceDelete = async (req, res) => {
    try {
        const invoice = await invoiceService.deletation(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const invoiceUpdate = async (req, res) => {
    try {
        const invoice = await invoiceService.edit(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice updated successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allInvoice = async (req, res) => {
    try {
        const invoice = await invoiceService.all(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice list fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const changeStatus = async (req, res) => {
    try {
        const invoice = await invoiceService.status(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice marked as paid successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const downloadInvoice = async (req, res) => {
    try {
        const invoice = await invoiceService.download(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice pdf generated successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const sendInvoiceMail = async (req, res) => {
    try {
        const invoice = await invoiceService.status(req, res);

        if (!invoice) return;

        return successResponse(res, invoice, 'Invoice marked as paid successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    allCustomer,
    fetchStockList,
    fetchInvoiceNumber,
    createInvoice,
    invoiceDetail,
    invoiceDelete,
    invoiceUpdate,
    allInvoice,
    changeStatus,
    downloadInvoice,
    sendInvoiceMail
};