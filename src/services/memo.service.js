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
        const response = await find({
            model: 'Stock',
            query: {
                isDeleted: false,
                status: CONSTANT.STOCK_STATUS.AVAILABLE
            },
            projection: { _id: 1, diamondName: 1, refNo: 1, carat: '$availableCarat', remarks: 1, pricePerCarat: 1, price: 1 }
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

        const stockIds = payload.items.filter(item => item._id).map(item => item._id);

        const stocks = await find({
            model: 'Stock',
            query: { _id: { $in: stockIds } },
            projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
        });

        for (let index = 0; index < payload.items.length; index++) {
            const element = payload.items[index];

            if (element._id) {
                const stock = stocks.find(stock => stock._id.toString() === element._id.toString());

                if (stock.availableCarat < Number(element.carat)) {
                    return errorResponse(
                        res,
                        null,
                        'Insufficient Stock',
                        `Stock with Ref No: ${stock.refNo} has available carat ${stock.availableCarat}, which is less than the requested carat ${element.carat}.`,
                        400
                    );
                }
            }
        }

        const createMemo = await create({
            model: 'Memo',
            data: {
                memoNumber: await getNextMemoNumber(),
                customer: payload.customer,
                numberOfItems: payload.items?.length,
                totalValue: getColumnTotal(payload.items, 'price'),
                createdBy: loginUser.userId
            }
        });

        for (let index = 0; index < payload.items.length; index++) {
            const element = payload.items[index];
            const stockId = element._id || null;
            delete element._id;

            if (stockId !== null) {
                const stock = stocks.find(stock => stock._id.toString() === stockId.toString());

                stock.availableCarat = Number((stock.availableCarat - Number(element.carat)).toFixed(2));
                stock.memoCarat = Number((stock.memoCarat + Number(element.carat)).toFixed(2));

                if (stock.availableCarat === 0) {
                    if (stock.memoCarat > 0 && stock.availableCarat === 0) {
                        stock.status = CONSTANT.STOCK_STATUS.ON_MEMO;
                    } else if (stock.memoCarat === 0 && stock.availableCarat === 0 && stock.soldCarat > 0) {
                        stock.status = CONSTANT.STOCK_STATUS.SOLD;
                    } else {
                        stock.status = CONSTANT.STOCK_STATUS.AVAILABLE
                    }
                }

                await update({
                    model: 'Stock',
                    query: { _id: stock._id },
                    updateData: {
                        $set: {
                            availableCarat: stock.availableCarat,
                            memoCarat: stock.memoCarat,
                            status: stock.status
                        }
                    }
                });
            }

            await create({
                model: 'MemoItem',
                data: {
                    memoId: createMemo._id,
                    stockId: stockId,
                    manualEntry: stockId !== null ? false : true,
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
                populate: { path: 'customer', select: '_id name address phone' }
            }
        });

        if (!memoInfo) {
            return errorResponse(res, null, 'Not Found', 'Memo not exists at this moment.', 404);
        }

        let memoItems = await find({
            model: 'MemoItem',
            query: { memoId: payload.memoId },
            projection: { memoId: 0, addedBy: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            options: { sort: { _id: 1 } }
        });

        memoItems = memoItems.map(item => ({
            ...item._doc,
            carat: item._doc.carat?.toString()
        }));

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

        const memoItems = await find({
            model: 'MemoItem',
            query: { memoId: payload.memoId },
            projection: { memoId: 0, addedBy: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            options: { sort: { _id: 1 } }
        });

        const stockIds = memoItems.filter(item => item.stockId).map(item => item.stockId);

        const stocks = await find({
            model: 'Stock',
            query: { _id: { $in: stockIds } },
            projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
        });

        for (let index = 0; index < memoItems.length; index++) {
            const element = memoItems[index];

            const memoItemDetail = await findOne({
                model: 'MemoItem',
                query: {
                    memoId: payload.memoId,
                    _id: element._id
                }
            });

            if (element.stockId !== null) {
                const stock = stocks.find(stock => stock._id.toString() === element.stockId.toString());

                if (stock) {
                    stock.availableCarat = Number((stock.availableCarat + Number(memoItemDetail.carat)).toFixed(2));
                    stock.memoCarat = Number((stock.memoCarat - Number(memoItemDetail.carat)).toFixed(2));

                    if (stock.memoCarat > 0 && stock.availableCarat === 0) {
                        stock.status = CONSTANT.STOCK_STATUS.ON_MEMO;
                    } else if (stock.memoCarat === 0 && stock.availableCarat === 0 && stock.soldCarat > 0) {
                        stock.status = CONSTANT.STOCK_STATUS.SOLD;
                    } else {
                        stock.status = CONSTANT.STOCK_STATUS.AVAILABLE
                    }
                }

                await update({
                    model: 'Stock',
                    query: { _id: stock._id },
                    updateData: {
                        $set: {
                            availableCarat: stock.availableCarat,
                            memoCarat: stock.memoCarat,
                            status: stock.status
                        }
                    }
                });
            }

            deleteById({ model: 'MemoItem', id: element._id });
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

        const stockIds = payload.items.filter(item => item.stockId).map(item => item.stockId);

        const stocks = await find({
            model: 'Stock',
            query: { _id: { $in: stockIds } },
            projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
        });

        // Clone stock data to avoid mutation issues
        const stocksCopy = JSON.parse(JSON.stringify(stocks));

        for (let index = 0; index < payload.items.length; index++) {
            const element = payload.items[index];

            if (element.stockId && element.stockId !== null) {
                const stockValidate = stocks.find(stock => stock._id.toString() === element.stockId.toString());

                const memoItemDetail = await findOne({
                    model: 'MemoItem',
                    query: {
                        memoId: payload.memoId,
                        stockId: element.stockId
                    }
                });

                if (memoItemDetail !== null) {
                    stockValidate.availableCarat = Number((stockValidate.availableCarat + Number(memoItemDetail.carat)).toFixed(2));
                }

                if (stockValidate.availableCarat < Number(element.carat)) {
                    return errorResponse(
                        res,
                        null,
                        'Insufficient Stock',
                        `Stock with Ref No: ${stockValidate.refNo} has available carat ${stockValidate.availableCarat}, which is less than the requested carat ${element.carat}.`,
                        400
                    );
                }
            }
        }

        for (let index = 0; index < payload.items.length; index++) {
            const element = payload.items[index];

            const memoItemDetail = await findOne({
                model: 'MemoItem',
                query: {
                    _id: element._id,
                    memoId: payload.memoId,
                    stockId: element.stockId
                }
            });

            if (memoItemDetail !== null) {
                delete element._id;

                if (element.stockId !== null) {
                    const stock = stocksCopy.find(stock => stock._id.toString() === element.stockId.toString());
                    // console.log("Find Stock : ", stock);

                    if (memoItemDetail !== null) {
                        stock.availableCarat = Number(((stock.availableCarat + Number(memoItemDetail.carat)) - Number(element.carat)).toFixed(2));
                        stock.memoCarat = Number(((stock.memoCarat - Number(memoItemDetail.carat)) + Number(element.carat)).toFixed(2));
                    }

                    if (stock.memoCarat > 0 && stock.availableCarat === 0) {
                        stock.status = CONSTANT.STOCK_STATUS.ON_MEMO;
                    } else if (stock.memoCarat === 0 && stock.availableCarat === 0 && stock.soldCarat > 0) {
                        stock.status = CONSTANT.STOCK_STATUS.SOLD;
                    } else {
                        stock.status = CONSTANT.STOCK_STATUS.AVAILABLE
                    }
                    // console.log("Update Stock : ", stock);

                    // console.log("Update With Stock Element : ", element);

                    await update({
                        model: 'Stock',
                        query: { _id: stock._id },
                        updateData: {
                            $set: {
                                availableCarat: stock.availableCarat,
                                memoCarat: stock.memoCarat,
                                status: stock.status
                            }
                        }
                    });

                    await update({
                        model: 'MemoItem',
                        query: { _id: memoItemDetail._id },
                        updateData: { $set: element }
                    });
                } else {
                    // console.log("Update Without Stock Element : ", element);

                    await update({
                        model: 'MemoItem',
                        query: { _id: memoItemDetail._id },
                        updateData: { $set: element }
                    });
                }
            } else {
                // console.log("Create New Element : ", element);

                if (element._id) {
                    const stock = await findOne({
                        model: 'Stock',
                        query: { _id: element._id },
                        projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
                    });

                    if (stock) {
                        stock.availableCarat = Number((stock.availableCarat - Number(element.carat)).toFixed(2));
                        stock.memoCarat = Number((stock.memoCarat + Number(element.carat)).toFixed(2));

                        if (stock.memoCarat > 0 && stock.availableCarat === 0) {
                            stock.status = CONSTANT.STOCK_STATUS.ON_MEMO;
                        } else if (stock.memoCarat === 0 && stock.availableCarat === 0 && stock.soldCarat > 0) {
                            stock.status = CONSTANT.STOCK_STATUS.SOLD;
                        } else {
                            stock.status = CONSTANT.STOCK_STATUS.AVAILABLE
                        }
                    }
                    // console.log("Update With Stock Element : ", stock);

                    await update({
                        model: 'Stock',
                        query: { _id: stock._id },
                        updateData: {
                            $set: {
                                availableCarat: stock.availableCarat,
                                memoCarat: stock.memoCarat,
                                status: stock.status
                            }
                        }
                    });
                }

                await create({
                    model: 'MemoItem',
                    data: {
                        memoId: payload.memoId,
                        stockId: element.stockId,
                        manualEntry: element.stockId !== null ? false : true,
                        ...element,
                        addedBy: loginUser.userId
                    }
                });
            }
        }

        for (let index = 0; index < payload.removedItems.length; index++) {
            const element = payload.removedItems[index];

            const memoItemDetail = await findOne({
                model: 'MemoItem',
                query: {
                    memoId: payload.memoId,
                    _id: element
                }
            });

            if (memoItemDetail !== null && memoItemDetail.stockId !== null) {
                const stock = await findOne({
                    model: 'Stock',
                    query: { _id: memoItemDetail.stockId },
                    projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
                });
                // console.log("Removed Stock Find : ", stock);

                if (stock) {
                    stock.availableCarat = Number((stock.availableCarat + Number(memoItemDetail.carat)).toFixed(2));
                    stock.memoCarat = Number((stock.memoCarat - Number(memoItemDetail.carat)).toFixed(2));

                    if (stock.memoCarat > 0 && stock.availableCarat === 0) {
                        stock.status = CONSTANT.STOCK_STATUS.ON_MEMO;
                    } else if (stock.memoCarat === 0 && stock.availableCarat === 0 && stock.soldCarat > 0) {
                        stock.status = CONSTANT.STOCK_STATUS.SOLD;
                    } else {
                        stock.status = CONSTANT.STOCK_STATUS.AVAILABLE
                    }
                }
                // console.log(stock);

                await update({
                    model: 'Stock',
                    query: { _id: stock._id },
                    updateData: {
                        $set: {
                            availableCarat: stock.availableCarat,
                            memoCarat: stock.memoCarat,
                            status: stock.status
                        }
                    }
                });
            }

            // console.log("Delete With Stock Element : ", element);

            deleteById({ model: 'MemoItem', id: element })
        };

        const updateMemo = await update({
            model: 'Memo',
            query: { _id: memoInfo._id },
            updateData: {
                $set: {
                    numberOfItems: payload.items.length,
                    totalValue: getColumnTotal(payload.items, 'price')
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