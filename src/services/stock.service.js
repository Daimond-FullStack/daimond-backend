const { deleteLocalFile } = require("../middleware/multer.middleware");
const { CUSTOMER } = require("../utils/constant");
const { find, findOne, create, countDocuments, update } = require("../utils/database");
const { generateProfessionalDiamondID } = require("../utils/helper");
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

const upload = async (req, res) => {
    try {
        const files = req.files;

        if (!files && files.length == 0) {
            return errorResponse(res, null, 'Not Found', 'No files uploaded.', 404);
        }

        const filePath = [];
        files.map((file) => {
            filePath.push((file?.destination + '/' + file?.filename).replace('.', ''));
        })

        return filePath;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const remove = async (req, res) => {
    try {
        const payload = req.body;

        payload.url?.map(async (url) => {
            await deleteLocalFile(url);
        });

        return true;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const addNew = async (req, res) => {
    try {
        const payload = req.body;
        const loginUser = req.user;

        const verifyStock = await findOne({ model: 'Stock', query: { certificateNo: payload.certificateNos } });

        if (verifyStock) {
            return errorResponse(res, null, 'Already Exist', 'Stock item already exists.', 400);
        }

        payload.diamondId = generateProfessionalDiamondID(payload.vendor.label);
        payload.vendor = payload.vendor.value;
        payload.createdBy = loginUser.userId;

        const createStock = await create({ model: 'Stock', data: payload });

        return createStock;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const detail = async (req, res) => {
    try {
        const payload = req.body;

        const stockInfo = await findOne({ 
            model: 'Stock', 
            query: { _id: payload.stockId, isDeleted: false },
            options: {
                populate:[
                    {
                        path:'vendor',
                        select: '_id name'
                    }
                ]
            }
        });

        if (!stockInfo) {
            return errorResponse(res, null, 'Not Found', 'Stock not exists at this moment.', 404);        }

        return stockInfo;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deletation = async (req, res) => {
    try {
        const payload = req.body;

        const verifyStock = await findOne({ model: 'Stock', query: { _id: payload.stockId, isDeleted: false } });

        if (!verifyStock) {
            return errorResponse(res, null, 'Not Found', 'Stock not exists at this moment.', 404);
        }

        let updateObj = {};
        updateObj.isDeleted = true;
        updateObj.deletedAt = new Date();

        const updateStock = await update({ model: 'Stock', query: { _id: payload.stockId }, updateData: { $set: updateObj } });

        return updateStock;
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

        const stockCount = countDocuments({
            model: 'Stock',
            query: {
                isDeleted: false
            }
        });

        const stocks = find({
            model: 'Stock',
            query: {
                isDeleted: false
            },
            options: {
                skip,
                limit: payload.limit,
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                },
                projection: { _id: 1, diamondId: 1, diamondName: 1, refNo: 1, carat: 1, shape: 1, size: 1, color: 1, clarity: 1, polish: 1 }
            }
        });

        const stockResponse = await Promise.allSettled([stockCount, stocks]);

        const response = {
            totalDocs: stockResponse[0].value,
            totalPages: Math.ceil(stockResponse[0].value / payload.limit),
            currentPage: payload.page,
            limit: payload.limit,
            docs: stockResponse[1].value
        };

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    list,
    upload,
    remove,
    addNew,
    detail,
    deletation,
    all
};