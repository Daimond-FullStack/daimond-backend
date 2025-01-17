const { CUSTOMER } = require("../utils/constant");
const { find } = require("../utils/database");
const { errorResponse } = require("../utils/responses");

const list = async (req, res) => {
    try {
        const vendors = await find({
            model: 'Customer',
            query: {
                userType: CUSTOMER.VENDOR,
                isDeleted: false
            },
            options: {
                sort: { fullName: 1 },
                projection: { _id: 1, name: 1, userType: 1, isDeleted: 1 }
            }
        });

        return vendors;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    list
};