const express = require("express");
const Route = express.Router();
const CartHandler = require("../../Db/cart");
const Auth = require("../../helper/decodejwt");
const Connection = require("../../Db/connection");

Route.use(Auth);
Route.use((req, res, next) => {
  try {
    Connection();
    next();
  } catch (error) {
    res.json({ message: "connection failed" });
  }
});


Route.get("/", async (req, res) => {
  try {
    const cartDetails = await CartHandler.find().populate("productid");
    res.json(cartDetails);
  } catch (error) {
    res.status(500).json({ message: "failed to fetch cart" });
  }
});


Route.post("/", async (req, res) => {
  try {
    const { _id, count } = req.body;
    const cart = {
      productid: _id,
      quantity: count,
    };
    const CartAdd = new CartHandler(cart);
    await CartAdd.save();
    res.json({
      message: "cart added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to add to cart",
    });
  }
});


Route.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const updatedCart = await CartHandler.findByIdAndUpdate(
      id,
      { quantity },
      { new: true } 
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({
      message: "cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to update cart",
    });
  }
});

Route.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCart = await CartHandler.findByIdAndDelete(id);

    if (!deletedCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({
      message: "cart deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to delete cart",
    });
  }
});

module.exports = Route;
