const mongoose = require("mongoose");
const CONSTANT = require("../utils/constant");

const stockSchema = new mongoose.Schema({
    diamondId: { type: String, required: true },
    type: { type: String, enum: Object.values(CONSTANT.STOCK_TYPE), default: CONSTANT.STOCK_TYPE.GIA_STONE },
    diamondName: { type: String, required: true },
    refNo: { type: String, required: true },
    carat: { type: Number, required: true },
    location: { type: String, required: true },
    shape: { type: String, required: true },
    color: { type: String, required: false },
    size: { type: String, required: false },
    clarity: { type: String, required: false },
    polish: { type: String, required: false },
    symmetry: { type: String, required: false },
    fl: { type: String, required: false },
    depth: { type: String, required: false },
    table: { type: String, required: false },
    measurement: {
        length: { type: String, required: false },
        height: { type: String, required: false },
        width: { type: String, required: false },
    },
    ratio: { type: String, required: false },
    cartId: { type: String, required: false },
    certificateNo: { type: String, required: false },
    diamondImages: { type: [String], required: false },
    remarks: { type: String, required: false },
    pic: { type: Number, default: 1 },
    cost: { type: String, required: false },
    costPerCarat: { type: String, required: false },
    pricePerCarat: { type: String, required: false },
    price: { type: String, required: false },
    status: { type: String, enum: Object.values(CONSTANT.STOCK_STATUS), default: CONSTANT.STOCK_STATUS.AVAILABLE },
    availableCarat: { type: Number, default: 0.00 },
    memoCarat: { type: Number, default: 0.00 },
    soldCarat: { type: Number, default: 0.00 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

stockSchema.index({ diamondId: 1 }, { unique: true });
stockSchema.index({ diamondName: 1 });
stockSchema.index({ refNo: 1 });
stockSchema.index({ vendor: 1 });
stockSchema.index({ location: 1 });
stockSchema.index({ status: 1 });

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
