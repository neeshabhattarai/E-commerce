const express=require('express');
const Auth = require('../../helper/decodejwt');
const CategoryModel=require("../../Db/categories");
const Connection = require('../../Db/connection');
const Route=express.Router();

Route.use(Auth);
Route.use((req, res, next) => {
  try {
    Connection();
    next();
  } catch (error) {
    res.json({ message: "connection failed" });
  }
});
Route.get("/",async(req,res)=>{
    try {
        
        const details=await CategoryModel.find();
        console.log(details);
       res.json(details);
    } catch (error) {
        res.json({
            message:"failed to load category",
            error:error
        })
    }
    
})
Route.post("/",async(req,res)=>{

    try {
        const {name}=req.body;
console.log(name);
        const Category=new CategoryModel({name});
       const result= await Category.save();

    res.json({
        message:"Successfully added category",
        result
    })
        
    } catch (error) {
        res.json({
            message:error
        })
    }
})
module.exports=Route;