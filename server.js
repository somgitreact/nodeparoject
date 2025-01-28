const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./model/productModel");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE;

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connection string"));

app.listen("5000", "127.0.0.1", (err) => console.log("project strt", err));
