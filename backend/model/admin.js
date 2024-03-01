const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String
  },

  zipCode: {
    type: String
  },

  addresses: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },


  newPassword: {
    type: String,
    
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
 
});


module.exports = mongoose.model("Admin", userSchema);
