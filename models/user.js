const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Field required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [30, "Name must not exceed 30 characters"],
  },
  avatar: {
    type: String,
    required: [true, "Field Required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validator: (value) => {
      console.log(value, "This is the correct email");
      return validator.isEmail(value);
    },
    message: "Invalid email address",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((endUser) => {
      if (!endUser) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, endUser.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return endUser;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
