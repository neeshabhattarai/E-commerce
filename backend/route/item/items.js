const express = require('express');
const Route = express();
const ItemDb = require("../../Db/items");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");
const Connection = require("../../Db/connection");
dotenv.config();


cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "testify",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

Route.use((req, res, next) => {
  try {
    Connection();
    next();
  } catch (error) {
    res.json({ message: "connection failed" });
  }
});



Route.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice, category, name } = req.query;
    let filter = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive regex
    }

    const itemDetails = await ItemDb.find(filter).populate("category");
    res.status(200).json(itemDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



Route.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const newItem = new ItemDb({
      name,
      description,
      price,
      category,
      image: req.file?.path || null,
      imageId: req.file?.filename || null, 
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update/Edit item
Route.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const item = await ItemDb.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

   
    if (req.file && item.imageId) {
      await cloudinary.uploader.destroy(item.imageId);
    }

 
    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.category = category || item.category;
    if (req.file) {
      item.image = req.file.path;
      item.imageId = req.file.filename;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


Route.delete("/:id", async (req, res) => {
  try {
    const item = await ItemDb.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

  
    if (item.imageId) {
      await cloudinary.uploader.destroy(item.imageId);
    }

    await ItemDb.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = Route;
