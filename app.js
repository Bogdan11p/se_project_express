const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
    // Server setup code goes here
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use((req, res, next) => {
  req.user = {
    _id: "",
  };
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
  console.log("This is working");
});
