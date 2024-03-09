const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true,"Please enter your post name!"],
    },
    description:{
        type: String,
        required:[true,"Please enter your post description!"],
    },
    category:{
        type: String,
        required:[true,"Please enter your post category!"],
    },
    status: {
        type: String,
        default: "Running",
    },
    tags:{
        type: String,
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
    shopId:{
        type: String,
        required: true,
    },
    shop:{
        type: Object,
    },
   
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("Post", postSchema);