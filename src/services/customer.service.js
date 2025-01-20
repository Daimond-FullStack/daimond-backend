const { CUSTOMER } = require("../utils/constant");
const { findOne, create, update, find, countDocuments } = require("../utils/database");
const { errorResponse } = require("../utils/responses");

const register = async (req, res) => {
    try {
        const payload = req.body;

        const verifyCustomer = await findOne({ model: 'Customer', query: { phone: payload.phone, isDeleted: false } });

        if (verifyCustomer) {
            return errorResponse(res, null, 'Already Exist', 'Customer already exists.', 400);
        }

        const createCustomer = await create({ model: 'Customer', data: payload });

        return createCustomer;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deletation = async (req, res) => {
    try {
        const payload = req.body;

        const verifyCustomer = await findOne({ model: 'Customer', query: { _id: payload.userId, isDeleted: false } });

        if (!verifyCustomer) {
            return errorResponse(res, null, 'Not Found', 'No account found, contact your admin.', 404);
        }

        let updateObj = {};
        updateObj.isDeleted = true;
        updateObj.deletedAt = new Date();

        const updateCustomer = await update({ model: 'Customer', query: { _id: payload.userId }, updateData: { $set: updateObj } });

        return updateCustomer;
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

        const userCount = countDocuments({
            model: 'Customer',
            query: {
                userType: payload.userType,
                isDeleted: false,
                $or: [
                    { name: { $regex: payload.search, $options: 'i' } },
                    { email: { $regex: payload.search, $options: 'i' } }
                ]
            }
        });

        const users = find({
            model: 'Customer',
            query: {
                userType: payload.userType,
                isDeleted: false,
                $or: [
                    { name: { $regex: payload.search, $options: 'i' } },
                    { phone: { $regex: payload.search, $options: 'i' } }
                ]
            },
            options: {
                skip,
                limit: payload.limit,
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                }
            }
        });

        const userResponse = await Promise.allSettled([userCount, users]);

        const response = {
            totalDocs: userResponse[0].value,
            totalPages: Math.ceil(userResponse[0].value / payload.limit),
            currentPage: payload.page,
            limit: payload.limit,
            docs: userResponse[1].value
        };

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    register,
    deletation,
    all
};