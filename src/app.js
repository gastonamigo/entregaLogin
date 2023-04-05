import express from "express";
import viewsRouter from "../src/routes/views.router.js";
import productsRouter from "../src/routes/products.router.js";
import cartsRouter from "../src/routes/carts.router.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Routers
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

mongoose.connect("mongodb+srv://gastonamigo:coder1234@servercoder.itp7dkf.mongodb.net/?retryWrites=true&w=majority").then((conn) => {
  console.log("Connected to DB!");
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});