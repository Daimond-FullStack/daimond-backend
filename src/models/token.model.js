const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        token: {
            type: String,
            required: true
        },
        generatedAt: {
            type: Date,
            default: Date.now,
            expires: 300
        }, // 5 minutes in seconds
    },
    { timestamps: true }
);

tokenSchema.index({ "user_id": 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
