const expenseService = require('../services/expense.service');

const { successResponse, errorResponse } = require('../utils/responses');

const addExpense = async (req, res) => {
    try {
        const expense = await expenseService.addNew(req, res);

        if (!expense) return;

        return successResponse(res, expense, 'Expense created successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const expenseDetail = async (req, res) => {
    try {
        const expense = await expenseService.detail(req, res);

        if (!expense) return;

        return successResponse(res, expense, 'Expense detail fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const editExpense = async (req, res) => {
    try {
        const expense = await expenseService.edit(req, res);

        if (!expense) return;

        return successResponse(res, expense, 'Expense updated successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await expenseService.deletation(req, res);

        if (!expense) return;

        return successResponse(res, expense, 'Expense deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allExpense = async (req, res) => {
    try {
        const expense = await expenseService.all(req, res);

        if (!expense) return;

        return successResponse(res, expense, 'Expense fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    addExpense,
    expenseDetail,
    editExpense,
    deleteExpense,
    allExpense
};