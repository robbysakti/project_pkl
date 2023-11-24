const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const koinProdSchema = new mongoose.Schema({
    koinProdName: {
        type: String,
        required: [true, "Please Input Product Name!"]
    },
    koinProdPrice: {
        type: Number,
        required: [true, "Please Input Product Price!"]
    },
    description: {
        type: String,
        required: [true, "Please Input Description!"]
    },

    category: {
        type: ObjectId,
        ref: "Category"
    },
    image: [{
        type: ObjectId,
        ref: "Image"
    }]
});

module.exports = mongoose.model("KoinProd", koinProdSchema);