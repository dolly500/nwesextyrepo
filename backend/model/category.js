const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your category name!"],
    },
    description: {
        type: String,
        required: [true, "Please enter your product description!"],
    },
    images:[
        {
            public_id: {
                type: String,
                required: true,
              },
              url: {
                type: String,
                required: true,
              },
        },
    ],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Category", categorySchema);
