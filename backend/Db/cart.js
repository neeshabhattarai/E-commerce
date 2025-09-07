const mongoose = require("mongoose");

const cart = new mongoose.Schema({
   quantity: {
       type: Number,
       required: true
   },
   productid: {
       type: mongoose.Schema.ObjectId,
       ref: "item",
       required: true,
   },
   userid: {
       type: mongoose.Schema.ObjectId,
       ref: "user", // Make sure your user model is named "user"
       required: true
   }
});

const cartModel = mongoose.model("cart", cart);
module.exports = cartModel;
