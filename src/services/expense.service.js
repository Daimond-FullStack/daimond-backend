const { CUSTOMER } = require("../utils/constant");
const { findOne, create, update, find, countDocuments } = require("../utils/database");
const { errorResponse } = require("../utils/responses");

const addNew = async (req, res) => {
    try {
        const payload = req.body;
        const loginUser = req.user;

        const verifyExpense = await findOne({ model: 'Expense', query: { category: payload.category, invoiceNumber: payload.invoiceNumber, isDeleted: false } });

        if (verifyExpense) {
            return errorResponse(res, null, 'Already Exist', 'Expense already exists.', 400);
        }

        payload.createdBy = loginUser.userId;

        const createExpense = await create({ model: 'Expense', data: payload });

        return createExpense;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const detail = async (req, res) => {
    try {
        const payload = req.body;

        const verifyExpense = await findOne({
            model: 'Expense',
            query: { _id: payload.expenseId, isDeleted: false },
            options: {
                populate: { path: 'createdBy', select: '_id fullName profilePic userType' }
            }
        });

        if (!verifyExpense) {
            return errorResponse(res, null, 'Not Found', 'Expense not exists at this moment.', 404);
        }

        return verifyExpense;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const edit = async (req, res) => {
    try {
        const payload = req.body;

        const verifyExpense = await findOne({
            model: 'Expense',
            query: { _id: payload.expenseId, isDeleted: false }
        });

        if (!verifyExpense) {
            return errorResponse(res, null, 'Not Found', 'Expense not exists at this moment.', 404);
        }

        const isAlreadyExist = await findOne({
            model: 'Expense',
            query: { category: payload.category, invoiceNumber: payload.invoiceNumber, _id: { $ne: payload.expenseId }, isDeleted: false }
        });

        if (isAlreadyExist) {
            return errorResponse(res, null, 'Already Exist', 'Expense already exists.', 400);
        }

        const updateExpense = await update({
            model: 'Expense',
            query: { _id: payload.expenseId, isDeleted: false },
            updateData: { $set: payload }
        });

        return updateExpense;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deletation = async (req, res) => {
    try {
        const payload = req.body;

        const verifyExpense = await findOne({ model: 'Expense', query: { _id: payload.expenseId, isDeleted: false } });

        if (!verifyExpense) {
            return errorResponse(res, null, 'Not Found', 'Expense not found at this moment.', 404);
        }

        let updateObj = {};
        updateObj.isDeleted = true;
        updateObj.deletedAt = new Date();

        const updateExpense = await update({ model: 'Expense', query: { _id: payload.expenseId }, updateData: { $set: updateObj } });

        return updateExpense;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const all = async (req, res) => {
    try {
        const payload = req.body;

        payload.page = payload.page ?? 1
        payload.limit = payload.limit ?? 10

        const skip = (payload.page - 1) * payload.limit;

        const expenseCount = countDocuments({
            model: 'Expense',
            query: { isDeleted: false }
        });

        const expenses = find({
            model: 'Expense',
            query: { isDeleted: false },
            options: {
                skip,
                limit: payload.limit,
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                }
            }
        });

        const expenseResponse = await Promise.allSettled([expenseCount, expenses]);

        const response = {
            totalDocs: expenseResponse[0].value,
            totalPages: Math.ceil(expenseResponse[0].value / payload.limit),
            currentPage: payload.page,
            limit: payload.limit,
            docs: expenseResponse[1].value
        };

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    addNew,
    detail,
    edit,
    deletation,
    all
};