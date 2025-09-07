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


// Fetch cart items for the logged-in user
Route.get("/", async (req, res) => {
  try {
    const cartDetails = await CartHandler.find({ userid: req.user.id }).populate("productid");
    res.json(cartDetails);
  } catch (error) {
    res.status(500).json({ message: "failed to fetch cart" });
  }
});

// Add item to cart for the logged-in user
Route.post("/", async (req, res) => {
  try {
    const { _id, count } = req.body;
    const cart = {
      productid: _id,
      quantity: count,
      userid: req.user.id, // <-- attach user id
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

// Update cart item (only allow if it belongs to the user)
Route.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const updatedCart = await CartHandler.findOneAndUpdate(
      { _id: id, userid: req.user.id }, // <-- ensure ownership
      { quantity },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart item not found or not yours" });
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

// Delete cart item (only allow if it belongs to the user)
Route.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCart = await CartHandler.findOneAndDelete({ _id: id, userid: req.user.id });

    if (!deletedCart) {
      return res.status(404).json({ message: "Cart item not found or not yours" });
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
