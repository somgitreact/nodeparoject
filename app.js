const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const orderRouter = require("./router/orderRouter");
const viewsRouter = require("./router/viewsRouter");
const Product = require("./model/productModel");
const blogRouter = require("./router/blogRouter");
const reviewRouter = require("./router/ratingRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.status(200).render("base"));
app.get("/signup", (req, res) => res.status(200).render("signup"));
app.get("/login", (req, res) => res.status(200).render("login"));

app.use("/api/v1/", productRouter);
app.use("/api/v1/", userRouter);
app.use("/", userRouter);
app.use("/api/v1/", orderRouter);
app.use("/backend", viewsRouter);
app.use("/blogadmin", blogRouter);
app.use("/blogapi", blogRouter);
app.use("/review", reviewRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).render("error", {
    message: err.message || "Internal Server Error",
    error: err,
  });
});
app.use((err, req, res, next) => {
  console.log(err);
  console.log(err.statusCode);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    // status: "fail",
    // message: err.message,
    // dsd:'jhj'
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
