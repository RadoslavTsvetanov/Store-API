require("dotenv").config();
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");
const app = express();
port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send('<h1>hi</h1><a href = "/api/v1/products">products</a>');
});
app.use("/api/v1/products", productsRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port);
    console.log("server set up successfully");
  } catch (err) {
    console.log(err);
  }
};

start();
