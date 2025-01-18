const customerService = require('../services/customer.service');

const { successResponse, errorResponse } = require('../utils/responses');

const registerCustomer = async (req, res) => {
    try {
        const customer = await customerService.register(req, res);

        if (!customer) return;

        return successResponse(res, customer, 'Customer registered successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customer = await customerService.deletation(req, res);

        if (!customer) return;

        return successResponse(res, customer, 'Customer deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allCustomer = async (req, res) => {
    try {
        const customer = await customerService.all(req, res);

        if (!customer) return;

        return successResponse(res, customer, 'Customer fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    registerCustomer,
    deleteCustomer,
    allCustomer
};