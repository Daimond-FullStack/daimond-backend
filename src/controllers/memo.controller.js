const memoService = require('../services/memo.service');

const { successResponse, errorResponse } = require('../utils/responses');

const allCustomer = async (req, res) => {
    try {
        const customer = await memoService.list(req, res);

        if (!customer) return;

        return successResponse(res, customer, 'Customer fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const fetchStock = async (req, res) => {
    try {
        const stock = await memoService.fetch(req, res);

        if (!stock) return;

        return successResponse(res, stock, 'Stock fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const createMemo = async (req, res) => {
    try {
        const memo = await memoService.creation(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Memo created successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const memoDetail = async (req, res) => {
    try {
        const memo = await memoService.detail(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Memo created successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const memoDelete = async (req, res) => {
    try {
        const memo = await memoService.deletation(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Memo deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const memoUpdate = async (req, res) => {
    try {
        const memo = await memoService.edit(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Memo created successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allMemo = async (req, res) => {
    try {
        const memo = await memoService.all(req, res);

        if (!memo) return;

        return successResponse(res, memo, 'Memo list fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    allCustomer,
    fetchStock,
    createMemo,
    memoDetail,
    memoDelete,
    memoUpdate,
    allMemo
};