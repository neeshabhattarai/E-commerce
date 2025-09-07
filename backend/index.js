const express=require('express');
const cors=require('cors');
const productRoute=require("./route/item/items");
const userRoute=require("./route/item/user");
const categoryRoute=require("./route/item/category");
const cartRoute=require("./route/item/cart");



const dotenv=require('dotenv');

const app=express();
dotenv.config();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.get("/",(req,res)=>{
    res.json({
        message:"server connected"
    })
})
app.use("/product",productRoute);
app.use("/user",userRoute)
app.use("/category",categoryRoute);
app.use("/cart",cartRoute)
module.exports=app;