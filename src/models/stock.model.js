const mongoose = require("mongoose");
const CONSTANT = require("../utils/constant");

const stockSchema = new mongoose.Schema({
    diamondId: { type: String, required: true },
    diamondName: { type: String, required: true },
    refNo: { type: String, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    location: { type: String, required: true },
    carat: { type: String, required: true },
    color: { type: String, required: true },
    shape: { type: String, required: true },
    size: { type: String, required: false },
    clarity: { type: String, required: true },
    polish: { type: String, required: true },
    symmetry: { type: String, required: true },
    fl: { type: String, required: false },
    depth: { type: String, required: false },
    table: { type: String, required: false },
    measurement: {
        length: { type: String, required: true },
        height: { type: String, required: true },
        width: { type: String, required: true },
    },
    ratio: { type: String, required: false },
    cartId: { type: String, required: false },
    certificateNo: { type: String, required: true },
    diamondImages: { type: [String], required: false },
    remarks: { type: String, required: false },
    status: { type: String, enum: Object.values(CONSTANT.STOCK_STATUS), default: CONSTANT.STOCK_STATUS.AVAILABLE },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

stockSchema.index({ diamondId: 1 }, { unique: true });
stockSchema.index({ diamondName: 1 });
stockSchema.index({ refNo: 1 });
stockSchema.index({ vendor: 1 });
stockSchema.index({ location: 1 });
stockSchema.index({ status: 1 });

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
