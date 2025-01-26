const { populate } = require("../models/user.model");
const CONSTANT = require("../utils/constant");
const { findOne, create, update, find, countDocuments, deleteById } = require("../utils/database");
const { errorResponse } = require("../utils/responses");

const list = async (req, res) => {
    try {
        const response = await find({
            model: 'Customer',
            query: {
                userType: CONSTANT.CUSTOMER.CUSTOMER,
                isDeleted: false
            },
            projection: { _id: 1, name: 1, phone: 1, address: 1, isDeleted: 1 },
            options: { sort: { name: 1 } }
        });

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const fetch = async (req, res) => {
    try {
        const payload = req.body;

        const response = await findOne({
            model: 'Stock',
            query: {
                refNo: payload.refNo,
                isDeleted: false,
                status: CONSTANT.STOCK_STATUS.AVAILABLE
            },
            projection: { _id: 1, refNo: 1, carat: 1, remarks: 1, pricePerCarat: 1, price: 1 }
        });

        if (!response) {
            return errorResponse(res, null, 'Not Found', 'Stock not exists at this moment.', 404);
        }

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const getNextMemoNumber = async () => {
    const lastMemo = await findOne({
        model: 'Memo',
        query: {},
        options: { sort: { memoNumber: -1 } }
    });

    let nextMemoNumber = "M-00001";

    if (lastMemo) {
        const lastMemoNumber = lastMemo.memoNumber;
        const lastNumber = parseInt(lastMemoNumber.replace('M-', ''), 10);

        const nextNumber = lastNumber + 1;

        nextMemoNumber = `M-${nextNumber.toString().padStart(5, '0')}`;
    }

    const validMemoNo = await findOne({
        model: 'Memo',
        query: { memoNumber: nextMemoNumber }
    });

    if (validMemoNo) {
        return getNextMemoNumber();
    }

    return nextMemoNumber;
}

function getColumnTotal(data, columnKey) {
    return data.reduce((sum, row) => {
        const value = parseFloat(row[columnKey]) || 0;
        return Math.round((sum + value) * 100) / 100;
    }, 0);
};

const creation = async (req, res) => {
    try {
        const payload = req.body;
        const loginUser = req.user;

        const customerVerification = await findOne({
            model: 'Customer',
            query: { _id: payload.customer, isDeleted: false }
        });

        if (!customerVerification) {
            return errorResponse(res, null, 'Not Found', 'Customer not exists at this moment.', 404);
        }

        const itemsRefNo = payload.items?.map(item => item?.refNo)
        const stockVerification = await find({
            model: 'Stock',
            query: { refNo: { $in: itemsRefNo }, status: CONSTANT.STOCK_STATUS.AVAILABLE, isDeleted: false }
        });

        if (!stockVerification.length && stockVerification.length === itemsRefNo.length) {
            return errorResponse(res, null, 'Not Found', 'One or more items are not available in stock.', 404);
        }

        const createMemo = await create({
            model: 'Memo',
            data: {
                memoNumber: await getNextMemoNumber(),
                customer: payload.customer,
                numberOfItems: payload.items?.length,
                totalValue: getColumnTotal(payload.items, 'price'),
                carats: getColumnTotal(payload.items, 'carats'),
                createdBy: loginUser.userId
            }
        });

        for (let index = 0; index < payload.items.length; index++) {
            const element = payload.items[index];

            await update({
                model: 'Stock',
                query: { refNo: element.refNo },
                updateData: { $set: { status: CONSTANT.STOCK_STATUS.ON_MEMO } }
            });

            await create({
                model: 'MemoItem',
                data: {
                    memoId: createMemo._id,
                    ...element,
                    addedBy: loginUser.userId
                }
            });
        }

        return createMemo;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const detail = async (req, res) => {
    try {
        const payload = req.body;

        const memoInfo = await findOne({
            model: 'Memo',
            query: { _id: payload.memoId, isDeleted: false },
            options: {
                populate: { path: 'customer' }
            }
        });

        if (!memoInfo) {
            return errorResponse(res, null, 'Not Found', 'Memo not exists at this moment.', 404);
        }

        const memoItems = await find({
            model: 'MemoItem',
            query: { memoId: payload.memoId },
            projection: { memoId: 0, addedBy: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            options: { sort: { _id: 1 } }
        });

        return { ...memoInfo._doc, memoItems };
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deletation = async (req, res) => {
    try {
        const payload = req.body;

        const verifyMemo = await findOne({ model: 'Memo', query: { _id: payload.memoId, isDeleted: false } });

        if (!verifyMemo) {
            return errorResponse(res, null, 'Not Found', 'Memo not exists at this moment.', 404);
        }

        let updateObj = {};
        updateObj.isDeleted = true;
        updateObj.deletedAt = new Date();

        const updateMemo = await update({ model: 'Memo', query: { _id: payload.memoId }, updateData: { $set: updateObj } });

        return updateMemo;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const edit = async (req, res) => {
    try {
        const payload = req.body;
        const loginUser = req.user;

        const memoInfo = await findOne({
            model: 'Memo',
            query: { _id: payload.memoId, isDeleted: false },
            options: { populate: { path: 'customer' } }
        });

        if (!memoInfo) {
            return errorResponse(res, null, 'Not Found', 'Memo not exists at this moment.', 404);
        }

        const customerVerification = await findOne({
            model: 'Customer',
            query: { _id: payload.customer, isDeleted: false }
        });

        if (!customerVerification) {
            return errorResponse(res, null, 'Not Found', 'Customer not exists at this moment.', 404);
        }

        if (payload.newItems.length > 0) {
            const itemsRefNo = payload.newItems.map(item => item?.refNo);
            const availableStock = await find({
                model: 'Stock',
                query: {
                    refNo: { $in: itemsRefNo },
                    status: { $ne: CONSTANT.STOCK_STATUS.AVAILABLE },
                    isDeleted: false
                }
            });

            if (availableStock.length) {
                return errorResponse(res, null, 'Not Found', 'One or more items are not available in stock.', 404);
            }
        }

        const newItemsPromises = payload.newItems.map(async item => {
            await update({
                model: 'Stock',
                query: { refNo: item.refNo },
                updateData: { $set: { status: CONSTANT.STOCK_STATUS.ON_MEMO } }
            });

            return create({
                model: 'MemoItem',
                data: {
                    memoId: memoInfo._id,
                    ...item,
                    addedBy: loginUser.userId
                }
            });
        });

        const removedItemsPromises = payload.removedItems.map(id =>
            deleteById({ model: 'MemoItem', id })
        );

        const updatedItemsPromises = payload.updatedItems.map(item =>
            update({
                model: 'MemoItem',
                query: { _id: item._id },
                updateData: { $set: item }
            })
        );

        // Execute all promises
        await Promise.all([
            ...newItemsPromises,
            ...removedItemsPromises,
            ...updatedItemsPromises
        ]);

        const memoItems = await find({
            model: 'MemoItem',
            query: { memoId: memoInfo._id },
            projection: { _id: 1, price: 1, carats: 1 }
        });

        const updateMemo = await update({
            model: 'Memo',
            query: { _id: memoInfo._id },
            updateData: {
                $set: {
                    numberOfItems: memoItems.length,
                    totalValue: getColumnTotal(memoItems, 'price'),
                    carats: getColumnTotal(memoItems, 'carats'),
                }
            }
        });

        return updateMemo;
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

        const memoCount = countDocuments({
            model: 'Memo',
            query: { isDeleted: false }
        });

        const memo = find({
            model: 'Memo',
            query: { isDeleted: false },
            options: {
                skip,
                limit: payload.limit,
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                },
                populate: { path: 'customer', select: 'name' },
                projection: { _id: 1, memoNumber: 1, customer: 1, numberOfItems: 1, totalValue: 1, createdAt: 1, status: 1 }
            }
        });

        const memoResponse = await Promise.allSettled([memoCount, memo]);

        const response = {
            totalDocs: memoResponse[0].value,
            totalPages: Math.ceil(memoResponse[0].value / payload.limit),
            currentPage: payload.page,
            limit: payload.limit,
            docs: memoResponse[1].value
        };

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    list,
    fetch,
    creation,
    detail,
    deletation,
    edit,
    all
};