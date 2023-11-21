const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const TopUpSchema = new mongoose.Schema({
    invoice: {
        type: String,
        required: true
    },
    user: {
        _id: {
            type: ObjectId,
            ref: "User",
            required: true
        },
        name: { type: String }
    },
    total: { type: Number, required: true },
    admin: {
        _id: {
            type: ObjectId,
            ref: "User",
            required: true
        },
        name: { type: String }
    },
});

module.exports = mongoose.model("TopUp", TopUpSchema);