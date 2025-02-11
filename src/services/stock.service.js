const { deleteLocalFile } = require("../middleware/multer.middleware");

const serverConfig = require("../config");

const { CUSTOMER } = require("../utils/constant");
const { errorResponse } = require("../utils/responses");
const { find, findOne, create, countDocuments, update } = require("../utils/database");
const { generateProfessionalDiamondID, excelToJson, exportFileFunction, convertToIST, getExcelFileName, excelFileDownload } = require("../utils/helper");

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

        const verifyStock = await findOne({ model: 'Stock', query: { refNo: payload.refNo } });

        if (verifyStock) {
            return errorResponse(res, null, 'Already Exist', 'Stock item already exists.', 400);
        }

        payload.diamondId = generateProfessionalDiamondID();
        payload.createdBy = loginUser.userId;
        payload.availableCarat = payload.carat;

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
            query: { _id: payload.stockId, isDeleted: false }
        });

        if (!stockInfo) {
            return errorResponse(res, null, 'Not Found', 'Stock not exists at this moment.', 404);
        }

        return stockInfo;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const history = async (req, res) => {
    try {
        const payload = req.body;

        const memoItems = await find({
            model: 'MemoItem',
            query: { stockId: payload.stockId },
            projection: { memoId: 1, addedBy: 1, carat: 1, createdAt: 1 },
            options: {
                populate: [
                    { path: 'addedBy', select: 'fullName userType profilePic' },
                    { path: 'memoId', select: 'memoNumber' }
                ]
            }
        });

        const invoiceItems = await find({
            model: 'InvoiceItem',
            query: { stockId: payload.stockId },
            projection: { invoiceId: 1, addedBy: 1, carat: 1, createdAt: 1 },
            options: {
                populate: [
                    { path: 'addedBy', select: 'fullName userType profilePic' },
                    { path: 'invoiceId', select: 'invoiceNumber' }
                ]
            }
        });

        const mergedData = [...memoItems, ...invoiceItems];

        const sortedData = mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const historyData = sortedData.map(item => {
            const newItem = { ...item._doc };
        
            newItem.activityId = item.invoiceId ? item.invoiceId._id : item.memoId._id;
            newItem.id = item.invoiceId ? item.invoiceId.invoiceNumber : item.memoId.memoNumber;
            newItem.activity = item.invoiceId ? 'Sold' : 'On Memo';
        
            delete newItem.memoId;
            delete newItem.invoiceId;
        
            return newItem;
        });
        

        if (!historyData) {
            return errorResponse(res, null, 'Not Found', 'Stock history not exists at this moment.', 404);
        }

        return historyData;
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

const edit = async (req, res) => {
    try {
        const payload = req.body;

        const verifyStock = await findOne({ model: 'Stock', query: { _id: payload.stockId, isDeleted: false } });

        if (!verifyStock) {
            return errorResponse(res, null, 'Not Found', 'Stock not exists at this moment.', 404);
        }

        const updateStock = await update({ model: 'Stock', query: { _id: payload.stockId }, updateData: { $set: payload } });

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
                isDeleted: false,
                $or: [
                    { diamondId: { $regex: payload.search, $options: 'i' } },
                    { diamondName: { $regex: payload.search, $options: 'i' } },
                    { refNo: { $regex: payload.search, $options: 'i' } }
                ]
            }
        });

        const stocks = find({
            model: 'Stock',
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

const importExcel = async (req, res) => {
    try {
        const loginUser = req.user;

        const excelData = await excelToJson(req.file.path);

        const requiredFields = [
            'Daimond Name', 'RefNo', 'Carat', 'Price Per Carat', 'Color', 'Shape',
            'Size', 'Clarity', 'Polish', 'Symmetry', 'FL', 'Depth', 'Table', 'Length',
            'Width', 'Height', 'Ratio', 'Cart ID', 'Certificate Number', 'Location'
        ];

        let skippedStock = [],
            skippedStockDetail = [],
            message = '';
        const totalData = excelData.length;

        for (let i = 0; i < excelData.length; i++) {
            let rows = excelData[i];

            for (let field of requiredFields) {
                if (!rows[field]) {
                    message = `Missing required field: ${field}`;
                }
            }

            const verifyStock = await findOne({ model: 'Stock', query: { certificateNo: rows['Certificate Number'] } });

            if (verifyStock) {
                message = 'Stock item already exists.';
            }

            if (!message) {
                let insertObj = {};
                insertObj.diamondId = generateProfessionalDiamondID();
                insertObj.createdBy = loginUser.userId;
                insertObj.diamondName = rows['Daimond Name'];
                insertObj.refNo = rows['RefNo'];
                insertObj.carat = rows['Carat']?.toString();
                insertObj.pricePerCarat = rows['Price Per Carat']?.toString();
                insertObj.price = isNaN(rows['Carat'] * rows['Price Per Carat']) ? '0' : rows['Carat'] * rows['Price Per Carat']?.toString();
                insertObj.color = rows['Color'];
                insertObj.shape = rows['Shape'];
                insertObj.size = rows['Size']?.toString();
                insertObj.clarity = rows['Clarity'];
                insertObj.polish = rows['Polish'];
                insertObj.symmetry = rows['Symmetry'];
                insertObj.fl = rows['FL'];
                insertObj.depth = rows['Depth'];
                insertObj.table = rows['Table'];
                insertObj.measurement = {
                    length: rows['Length'],
                    height: rows['Height'],
                    width: rows['Width']
                };
                insertObj.ratio = rows['Ratio'];
                insertObj.cartId = rows['Cart ID'];
                insertObj.certificateNo = rows['Certificate Number'];
                insertObj.location = rows['Location'];
                insertObj.remarks = rows['Remarks'] ?? "";

                await create({ model: 'Stock', data: insertObj });
            }

            if (message) {
                rows.Message = message;
                rows.Row = i + 2;

                skippedStockDetail.push({
                    'Diamond Name': rows['Daimond Name'],
                    'Ref No': rows['RefNo'],
                    'Certificate Number': rows['Certificate Number'],
                    'Message': rows['Message'],
                    'Row': rows['Row'],
                });
                skippedStock.push(rows);
                message = '';
            }
        }

        const response = {};

        let uploadedStock = excelData.length - skippedStock.length;
        let skippedStockCount = skippedStock.length;

        response.totalData = totalData;
        response.skippedStockCount = skippedStockCount;
        response.skippedStocks = skippedStockDetail;
        response.uploadedStock = uploadedStock;

        if (skippedStock && skippedStock.length > 0) {
            const csvUrl = await exportFileFunction(
                true,
                'Skip-Stock-Excel',
                skippedStock
            );
            response.csvUrl = serverConfig.SERVER.URL + '/' + csvUrl.filePath;
        }

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
}

const exportExcel = async (req, res) => {
    try {
        const payload = req.body;

        const excelHeaders = [
            "Diamond ID", "Diamond Name", "Reference Number", "Location", "Carat", "Color", "Shape",
            "Size", "Clarity", "Polish", "Symmetry", "Fluorescence", "Depth", "Table", "Measurement",
            "Ratio", "Cart ID", "Certificate Number", "Diamond Images", "Remarks", "Status", "Created By",
            "Created At", "Updated At"
        ];

        const headerMapping = {
            "Diamond ID": "diamondId",
            "Diamond Name": "diamondName",
            "Reference Number": "refNo",
            "Location": "location",
            "Carat": "carat",
            "Color": "color",
            "Shape": "shape",
            "Size": "size",
            "Clarity": "clarity",
            "Polish": "polish",
            "Symmetry": "symmetry",
            "Fluorescence": "fl",
            "Depth": "depth",
            "Table": "table",
            "Measurement": "measurement",
            "Ratio": "ratio",
            "Cart ID": "cartId",
            "Certificate Number": "certificateNo",
            "Diamond Images": "diamondImages",
            "Remarks": "remarks",
            "Status": "status",
            "Created By": "createdBy",
            "Created At": "createdAt",
            "Updated At": "updatedAt"
        };

        const stocks = await find({
            model: 'Stock',
            query: {
                isDeleted: false,
                $or: [
                    { diamondId: { $regex: payload.search, $options: 'i' } },
                    { diamondName: { $regex: payload.search, $options: 'i' } }
                ]
            },
            options: {
                populate: {
                    path: 'createdBy',
                    select: 'fullName userType'
                },
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                },
                projection: { isDeleted: 0, deletedAt: 0 }
            }
        });

        const mappedStockData = stocks.map((stock) => {
            return excelHeaders.reduce((result, header) => {
                const fieldPath = headerMapping[header];
                let fieldValue;

                if (header === "Measurement") {
                    fieldValue = `${stock.measurement.length} x ${stock.measurement.height} x ${stock.measurement.width}`;
                } else {
                    fieldValue = fieldPath.split('.').reduce((obj, key) => obj && obj[key], stock);
                }

                if (header === "Diamond Images") {
                    result[header] = fieldValue ? fieldValue.map(imagePath => `${serverConfig.SERVER.URL}${imagePath}`).join(", ") : "";
                }
                else if (header === "Created By") {
                    result[header] = `${stock.createdBy.fullName} | ${stock.createdBy.userType}`;
                }
                else if (header === "Created At" || header === "Updated At") {
                    result[header] = fieldValue ? convertToIST(fieldValue) : "";
                }
                else {
                    result[header] = fieldValue || "";
                }

                return result;
            }, {});
        });

        const tempFile = await excelFileDownload(getExcelFileName('stock'), mappedStockData);

        return `${serverConfig.SERVER.URL}${tempFile.replace('.', '')}`
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
}

module.exports = {
    list,
    upload,
    remove,
    addNew,
    detail,
    history,
    deletation,
    edit,
    all,
    importExcel,
    exportExcel
};