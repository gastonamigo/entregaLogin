import { Router } from "express";
import { CartManager } from "../dao/index.js";
import { ProductManager } from "../dao/index.js";

const router = Router();
const ProductsManager = new ProductManager();
const CartsManager = new CartManager();

router.get("/products", async (req, res) => {
  const products = await ProductsManager.getAll();

  res.render("products", { products });
});

router.get("/carts", async (req, res) => {
  const carts = await CartsManager.getAll();

  res.render("carts", { carts });
});

export default router;