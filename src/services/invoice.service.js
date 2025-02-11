const serverConfig = require("../config");
const CONSTANT = require("../utils/constant");
const { findOne, create, update, find, countDocuments, deleteById } = require("../utils/database");
const { renderTemplate, generatePdf, generatePDF } = require("../utils/helper");
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
            projection: { _id: 1, diamondName: 1, refNo: 1, carat: '$availableCarat', pricePerCarat: 1, price: 1, remarks: 1, }
        });

        if (!response) {
            return errorResponse(res, null, 'Not Found', 'Stock not exists at this moment.', 404);
        }

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const fetchNext = async (req, res) => {
    try {
        const lastMemo = await findOne({
            model: 'Invoice',
            query: {},
            options: { sort: { invoiceNumber: -1 } }
        });

        let nextInvoiceNumber = "INV-00001";

        if (lastMemo) {
            const lastInvoiceNumber = lastMemo.invoiceNumber;
            const lastNumber = parseInt(lastInvoiceNumber.replace('INV-', ''), 10);

            const nextNumber = lastNumber + 1;

            nextInvoiceNumber = `INV-${nextNumber.toString().padStart(5, '0')}`;
        }

        const validMemoNo = await findOne({
            model: 'Invoice',
            query: { invoiceNumber: nextInvoiceNumber }
        });

        if (validMemoNo) {
            return getNextMemoNumber();
        }

        return nextInvoiceNumber;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
}

function getColumnTotal(data, columnKey) {
    return data.reduce((sum, row) => {
        const value = parseFloat(row[columnKey]) || 0;
        return Math.round((sum + value) * 100) / 100;
    }, 0);
};

function setDueDate(terms) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(terms));
    return dueDate;
}

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

        const createInvoice = await create({
            model: 'Invoice',
            data: {
                customer: payload.customer,
                billTo: payload.billTo,
                invoiceNumber: payload.invoiceNumber,
                address: payload.address,
                shipTo: payload.shipTo,
                shippingCharge: payload.shippingCharge,
                terms: payload.terms,
                dueDate: setDueDate(payload.terms),
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
                stock.soldCarat = Number((stock.soldCarat + Number(element.carat)).toFixed(2));

                if (stock.availableCarat === 0) {
                    if (stock.soldCarat > 0 && stock.availableCarat === 0) {
                        stock.status = CONSTANT.STOCK_STATUS.ON_MEMO;
                    } else if (stock.soldCarat === 0 && stock.availableCarat === 0 && stock.soldCarat > 0) {
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
                            soldCarat: stock.soldCarat,
                            status: stock.status
                        }
                    }
                });
            }

            await create({
                model: 'InvoiceItem',
                data: {
                    invoiceId: createInvoice._id,
                    stockId: stockId,
                    manualEntry: stockId !== null ? false : true,
                    ...element,
                    addedBy: loginUser.userId
                }
            });
        }

        return createInvoice;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const detail = async (req, res) => {
    try {
        const payload = req.body;

        const invoiceInfo = await findOne({
            model: 'Invoice',
            query: { _id: payload.sellInvoiceId },
            options: {
                populate: { path: 'customer', select: '_id name address' }
            }
        });

        if (!invoiceInfo) {
            return errorResponse(res, null, 'Not Found', 'Invoice not exists at this moment.', 404);
        }

        const invoiceItems = await find({
            model: 'InvoiceItem',
            query: { invoiceId: payload.sellInvoiceId },
            projection: { invoiceId: 0, addedBy: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            options: { sort: { _id: 1 } }
        });

        return { ...invoiceInfo._doc, invoiceItems };
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deletation = async (req, res) => {
    try {
        const payload = req.body;

        const verifyInvoice = await findOne({ model: 'Invoice', query: { _id: payload.sellInvoiceId } });

        if (!verifyInvoice) {
            return errorResponse(res, null, 'Not Found', 'Invoice not exists at this moment.', 404);
        }

        const invoiceItems = await find({
            model: 'InvoiceItem',
            query: { invoiceId: payload.sellInvoiceId },
            projection: { invoiceId: 0, addedBy: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            options: { sort: { _id: 1 } }
        });

        const stockIds = invoiceItems.filter(item => item.stockId).map(item => item.stockId);

        const stocks = await find({
            model: 'Stock',
            query: { _id: { $in: stockIds } },
            projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
        });

        for (let index = 0; index < invoiceItems.length; index++) {
            const element = invoiceItems[index];

            const memoItemDetail = await findOne({
                model: 'InvoiceItem',
                query: {
                    memoId: payload.memoId,
                    _id: element._id
                }
            });

            if (element.stockId !== null) {
                const stock = stocks.find(stock => stock._id.toString() === element.stockId.toString());

                if (stock) {
                    stock.availableCarat = Number((stock.availableCarat + Number(memoItemDetail.carat)).toFixed(2));
                    stock.soldCarat = Number((stock.soldCarat - Number(memoItemDetail.carat)).toFixed(2));

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
                            soldCarat: stock.soldCarat,
                            status: stock.status
                        }
                    }
                });
            }

            await deleteById({ model: 'InvoiceItem', id: element._id });
        }

        const deleteInvoice = await deleteById({ model: 'Invoice', id: payload.sellInvoiceId });

        return deleteInvoice;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const edit = async (req, res) => {
    try {
        const payload = req.body;
        const loginUser = req.user;

        const invoiceInfo = await findOne({
            model: 'Invoice',
            query: { _id: payload.sellInvoiceId },
            options: { populate: { path: 'customer', select: '_id name address' } }
        });

        if (!invoiceInfo) {
            return errorResponse(res, null, 'Not Found', 'Invoice not exists at this moment.', 404);
        }

        const customerVerification = await findOne({
            model: 'Customer',
            query: { _id: payload.customer, isDeleted: false }
        });

        if (!customerVerification) {
            return errorResponse(res, null, 'Not Found', 'Customer not exists at this moment.', 404);
        }

        const stockIds = payload.items
            .filter(item => (item.stockId && item.stockId !== null) || (!("stockId" in item) && item._id))
            .map(item => item.stockId || item._id);

        const stocks = await find({
            model: 'Stock',
            query: { _id: { $in: stockIds } },
            projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
        });

        // Clone stock data to avoid mutation issues
        const stocksCopy = JSON.parse(JSON.stringify(stocks));

        for (let index = 0; index < payload.items.length; index++) {
            const element = payload.items[index];

            if ((element.stockId !== null && element.stockId !== undefined) || (element.stockId === undefined && element._id)) {
                const stockValidate = stocks.find(stock =>
                    (element.stockId !== undefined && element.stockId !== null && stock._id.toString() === element.stockId.toString()) ||
                    (element.stockId === undefined && element._id && stock._id.toString() === element._id.toString())
                );

                if (!stockValidate) {
                    return errorResponse(
                        res,
                        null,
                        'Stock Not Found',
                        `Stock with Ref No: ${element.refNo} not found in the stocks list.`,
                        404
                    );
                }

                const invoiceItemDetail = await findOne({
                    model: 'InvoiceItem',
                    query: {
                        invoiceId: payload.sellInvoiceId,
                        stockId: element.stockId !== undefined ? element.stockId : element._id
                    }
                });

                if (invoiceItemDetail !== null) {
                    stockValidate.availableCarat = Number((stockValidate.availableCarat + Number(invoiceItemDetail.carat)).toFixed(2));
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

            const invoiceItemDetail = await findOne({
                model: 'InvoiceItem',
                query: {
                    _id: element._id,
                    memoId: payload.memoId,
                    stockId: element.stockId
                }
            });

            if (invoiceItemDetail !== null) {
                delete element._id;

                if (element.stockId !== null) {
                    const stock = stocksCopy.find(stock => stock._id.toString() === element.stockId.toString());
                    // console.log("Find Stock : ", stock);

                    if (invoiceItemDetail !== null) {
                        stock.availableCarat = Number(((stock.availableCarat + Number(invoiceItemDetail.carat)) - Number(element.carat)).toFixed(2));
                        stock.soldCarat = Number(((stock.soldCarat - Number(invoiceItemDetail.carat)) + Number(element.carat)).toFixed(2));
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
                                soldCarat: stock.soldCarat,
                                status: stock.status
                            }
                        }
                    });

                    await update({
                        model: 'InvoiceItem',
                        query: { _id: invoiceItemDetail._id },
                        updateData: { $set: element }
                    });
                } else {
                    // console.log("Update Without Stock Element : ", element);

                    await update({
                        model: 'InvoiceItem',
                        query: { _id: invoiceItemDetail._id },
                        updateData: { $set: element }
                    });
                }
            } else {
                if (element._id) {
                    const stock = await findOne({
                        model: 'Stock',
                        query: { _id: element._id },
                        projection: { _id: 1, refNo: 1, carat: 1, availableCarat: 1, memoCarat: 1, soldCarat: 1 }
                    });

                    if (stock) {
                        stock.availableCarat = Number((stock.availableCarat - Number(element.carat)).toFixed(2));
                        stock.soldCarat = Number((stock.soldCarat + Number(element.carat)).toFixed(2));

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
                                soldCarat: stock.soldCarat,
                                status: stock.status
                            }
                        }
                    });
                }

                const stockId = element._id || null;
                delete element._id;

                // console.log("Create New Element : ", {
                //     invoiceId: payload.sellInvoiceId,
                //     stockId: stockId,
                //     manualEntry: stockId !== null ? false : true,
                //     ...element,
                //     addedBy: loginUser.userId
                // });

                await create({
                    model: 'InvoiceItem',
                    data: {
                        invoiceId: payload.sellInvoiceId,
                        stockId: stockId,
                        manualEntry: stockId !== null ? false : true,
                        ...element,
                        addedBy: loginUser.userId
                    }
                });
            }
        }

        for (let index = 0; index < payload.removedItems.length; index++) {
            const element = payload.removedItems[index];

            const memoItemDetail = await findOne({
                model: 'InvoiceItem',
                query: {
                    invoiceId: payload.sellInvoiceId,
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
                    stock.soldCarat = Number((stock.soldCarat - Number(memoItemDetail.carat)).toFixed(2));

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
                            soldCarat: stock.soldCarat,
                            status: stock.status
                        }
                    }
                });
            }

            // console.log("Delete With Stock Element : ", element);

            deleteById({ model: 'InvoiceItem', id: element })
        };

        const updateInvoice = await update({
            model: 'Invoice',
            query: { _id: invoiceInfo._id },
            updateData: {
                $set: {
                    address: payload.address,
                    shipTo: payload.shipTo,
                    terms: payload.terms,
                    shippingCharge: payload.shippingCharge,
                    dueDate: setDueDate(payload.terms),
                    numberOfItems: payload.items.length,
                    totalValue: getColumnTotal(payload.items, 'price')
                }
            }
        });

        return updateInvoice;
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

        const invoiceCount = countDocuments({
            model: 'Invoice',
            query: {
                $or: [
                    { invoiceNumber: { $regex: payload.search, $options: 'i' } },
                ]
            }
        });

        const invoice = find({
            model: 'Invoice',
            query: {
                $or: [
                    { invoiceNumber: { $regex: payload.search, $options: 'i' } },
                ]
            },
            options: {
                skip,
                limit: payload.limit,
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                },
                populate: { path: 'customer', select: 'name' },
                projection: { _id: 1, invoiceNumber: 1, customer: 1, dueDate: 1, numberOfItems: 1, totalValue: 1, createdAt: 1, status: 1 }
            }
        });

        const invoiceResponse = await Promise.allSettled([invoiceCount, invoice]);

        const response = {
            totalDocs: invoiceResponse[0].value,
            totalPages: Math.ceil(invoiceResponse[0].value / payload.limit),
            currentPage: payload.page,
            limit: payload.limit,
            docs: invoiceResponse[1].value
        };

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const status = async (req, res) => {
    try {
        const payload = req.body;

        const verifyInvoice = await findOne({ model: 'Invoice', query: { _id: payload.sellInvoiceId } });

        if (!verifyInvoice) {
            return errorResponse(res, null, 'Not Found', 'Invoice not exists at this moment.', 404);
        }

        const updateObj = { status: CONSTANT.INVOICE_STATUS.PAID };

        const updateStatus = await update({ model: 'Invoice', query: { _id: payload.sellInvoiceId }, updateData: { $set: updateObj } });

        return updateStatus;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const download = async (req, res) => {
    try {
        const payload = req.body;

        const invoiceInfo = await findOne({
            model: 'Invoice',
            query: { _id: payload.sellInvoiceId },
            options: {
                populate: { path: 'customer', select: '_id name address phone' }
            }
        });

        if (!invoiceInfo) {
            return errorResponse(res, null, 'Not Found', 'Invoice not exists at this moment.', 404);
        }

        const invoiceItems = await find({
            model: 'InvoiceItem',
            query: { invoiceId: payload.sellInvoiceId },
            projection: { invoiceId: 0, addedBy: 0, createdAt: 0, updatedAt: 0, __v: 0 },
            options: { sort: { _id: 1 } }
        });

        const company = {
            peronalInfo: {
                name: serverConfig.COMPANY.INFORMATON.PERSONAL.NAME,
                address: serverConfig.COMPANY.INFORMATON.PERSONAL.ADDRESS,
                location: serverConfig.COMPANY.INFORMATON.PERSONAL.LOCATION,
                phoneNumber: serverConfig.COMPANY.INFORMATON.PERSONAL.PHONE_NUMBER,
                email: serverConfig.COMPANY.INFORMATON.PERSONAL.EMAIL
            },
            bankInfo: {
                name: serverConfig.COMPANY.INFORMATON.BANK.NAME,
                address: serverConfig.COMPANY.INFORMATON.BANK.ADDRESS,
                accountNumber: serverConfig.COMPANY.INFORMATON.BANK.ACCOUNT_NUMBER,
                abaRoutingNumber: serverConfig.COMPANY.INFORMATON.BANK.ABA_ROUTING_NUMBER,
                swiftCode: serverConfig.COMPANY.INFORMATON.BANK.SWIFT_CODE
            }
        };

        const invoice = { ...invoiceInfo._doc, totalCarats: getColumnTotal(invoiceItems), invoiceItems, company };

        const templatePath = process.cwd() + '/src/utils/email/templates/invoice-mail.handlebars';
        const outputPath = process.cwd() + `/public/Invoice/${Date.now()}-${invoice.invoiceNumber}.pdf`

        const html = await renderTemplate(templatePath, invoice);

        const pdf = await generatePDF(html, outputPath);

        return invoice;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    list,
    fetch,
    fetchNext,
    creation,
    detail,
    deletation,
    edit,
    all,
    status,
    download
};