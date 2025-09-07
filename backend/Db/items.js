const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  image:{
    type:String,
    required:true
  },
  imageId:{
type:String,
   
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true
  }
});

const Item = mongoose.model("item", itemSchema);
module.exports = Item;
