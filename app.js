const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const { PORT = 3001 } = process.env;
const app = express();

const { errorHandler } = require("./middlewares/errorHandling");

const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (r) => {
  console.log("connected to DB", r);
});

const routes = require("./routes");

app.use(express.json());

app.use(requestLogger);
app.use(routes);
app.use(cors());
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
  console.log("This is working");
});
