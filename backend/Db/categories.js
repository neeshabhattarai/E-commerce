const mongoose=require("mongoose");
const categories=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})
const categoryModel=mongoose.model("category",categories);
module.exports=categoryModel;