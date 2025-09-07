const express = require('express');
const Route = express();
const ItemDb = require("../../Db/items");
const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");
const Connection = require("../../Db/connection");

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Database connection middleware
Route.use((req, res, next) => {
  try {
    Connection();
    next();
  } catch (error) {
    res.json({ message: "connection failed" });
  }
});

// GET all items with filters
Route.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice, category, name } = req.query;
    let filter = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (category) filter.category = category;
    if (name) filter.name = { $regex: name, $options: "i" };

    const itemDetails = await ItemDb.find(filter).populate("category");
    res.status(200).json(itemDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST new item
Route.post("/", upload.single("image"), async (req, res) => {
  try {
    let image = null;
    let imageId = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "testify" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      image = result.secure_url;
      imageId = result.public_id;
    }

    const { name, description, price, category } = req.body;
    const newItem = new ItemDb({
      name,
      description,
      price,
      category,
      image,
      imageId,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE/Edit item
Route.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const item = await ItemDb.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Delete old image from Cloudinary if a new one is uploaded
    if (req.file && item.imageId) {
      await cloudinary.uploader.destroy(item.imageId);
    }

    let image = item.image;
    let imageId = item.imageId;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "testify" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      image = result.secure_url;
      imageId = result.public_id;
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.category = category || item.category;
    item.image = image;
    item.imageId = imageId;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE item
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
