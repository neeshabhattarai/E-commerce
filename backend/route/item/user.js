const express = require("express");
const Route = express.Router();
const Connection = require("../../Db/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRoute = require("../../Db/user");

Route.use((req, res, next) => {
  try {
    Connection();
    next();
  } catch (error) {
    res.json({ message: "connection failed" });
  }
});

Route.post("/", async (req, res) => {
    // console.log(req.body);
  try {
    const { name, email, password } = req.body;
    console.log(name,email,password);
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const user = new UserRoute({ name, email, password: hashedPassword });
    const userDetails = await user.save();
    res.status(201).json(userDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

Route.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    console.log(email,password);
    const user = await UserRoute.findOne({ email });
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.Secret_Key);
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

Route.get("/", async (req, res) => {
  try {
    const users = await UserRoute.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Route.get("/:id", async (req, res) => {
  try {
    const user = await UserRoute.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Route.put("/:id", async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await UserRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

Route.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await UserRoute.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = Route;
