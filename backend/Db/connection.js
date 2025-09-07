const mongoose=require("mongoose"
);
const Connection=async()=>{
    const connection= await mongoose.connect(`mongodb+srv://${process.env.DB_Name}:${process.env.DB_Password}@blog.f75wmeu.mongodb.net/`);
return connection
}
module.exports=Connection;
