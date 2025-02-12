const { deleteLocalFile } = require("../middleware/multer.middleware");

const CONSTANT = require("../utils/constant");
const { errorResponse } = require("../utils/responses");
const { find, findOne, create, countDocuments, update } = require("../utils/database");
const { generateProfessionalDiamondID } = require("../utils/helper");

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
            if (url.startsWith('http://') || url.startsWith('https://')) {
                url = '/public' + url.split('/public')[1];
                await deleteLocalFile(url);
            } else {
                await deleteLocalFile(url);
            }
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

        payload.diamondId = generateProfessionalDiamondID();
        payload.createdBy = loginUser.userId;
        payload.availableCarat = payload.carat;

        const createPurchase = await create({ model: 'Purchase', data: payload });

        return createPurchase;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const detail = async (req, res) => {
    try {
        const payload = req.body;

        const purchaseInfo = await findOne({
            model: 'Purchase',
            query: { _id: payload.purchaseId, isDeleted: false }
        });

        if (!purchaseInfo) {
            return errorResponse(res, null, 'Not Found', 'Purchase not exists at this moment.', 404);
        }

        return purchaseInfo;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deletation = async (req, res) => {
    try {
        const payload = req.body;

        const verifyPurchase = await findOne({ model: 'Purchase', query: { _id: payload.purchaseId, isDeleted: false } });

        if (!verifyPurchase) {
            return errorResponse(res, null, 'Not Found', 'Purchase not exists at this moment.', 404);
        }

        let updateObj = {};
        updateObj.isDeleted = true;
        updateObj.deletedAt = new Date();

        const updatePurchase = await update({ model: 'Purchase', query: { _id: payload.purchaseId }, updateData: { $set: updateObj } });

        return updatePurchase;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const edit = async (req, res) => {
    try {
        const payload = req.body;

        const verifyPurchase = await findOne({ model: 'Purchase', query: { _id: payload.purchaseId, isDeleted: false } });

        if (!verifyPurchase) {
            return errorResponse(res, null, 'Not Found', 'Purchase not exists at this moment.', 404);
        }

        const updatePurchase = await update({ model: 'Purchase', query: { _id: payload.purchaseId }, updateData: { $set: payload } });

        return updatePurchase;
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

        const purchaseCount = countDocuments({
            model: 'Purchase',
            query: {
                isDeleted: false,
                $or: [
                    { diamondId: { $regex: payload.search, $options: 'i' } },
                    { diamondName: { $regex: payload.search, $options: 'i' } },
                    { refNo: { $regex: payload.search, $options: 'i' } }
                ]
            }
        });

        const purchases = find({
            model: 'Purchase',
            query: {
                isDeleted: false,
                $or: [
                    { diamondId: { $regex: payload.search, $options: 'i' } },
                    { diamondName: { $regex: payload.search, $options: 'i' } },
                    { refNo: { $regex: payload.search, $options: 'i' } }
                ]
            },
            options: {
                skip,
                limit: payload.limit,
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                },
                projection: { _id: 1, diamondId: 1, diamondName: 1, refNo: 1, carat: 1, shape: 1, type: 1, size: 1, color: 1, clarity: 1, polish: 1, createdAt: 1, status: 1 }
            }
        });

        const purchaseResponse = await Promise.allSettled([purchaseCount, purchases]);

        const response = {
            totalDocs: purchaseResponse[0].value,
            totalPages: Math.ceil(purchaseResponse[0].value / payload.limit),
            currentPage: payload.page,
            limit: payload.limit,
            docs: purchaseResponse[1].value
        };

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    upload,
    remove,
    addNew,
    detail,
    deletation,
    edit,
    all
};