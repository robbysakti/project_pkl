const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const produkSchema = new mongoose.Schema({
    produkName: {
        type: String,
        required: [true, "Please Input Product Name!"]
    },
    produkPrice: {
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

module.exports = mongoose.model("Produk", produkSchema);