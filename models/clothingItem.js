const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Field required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [30, "Name must not exceed 30 characters"],
  },
  weather: {
    type: String,
    required: [true, "Field Required"],
    enum: ["hot", "warm", "cold"],
  },
  imageURL: {
    type: String,
    required: [true, "Image URL is Required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Field Required"],
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

model.exports = mongoose.model("clothingItem", clothingItem);
