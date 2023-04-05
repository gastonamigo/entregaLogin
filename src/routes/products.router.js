import { Router } from "express";
import { ProductManager } from "../dao/index.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getAll();

  res.send(products);
});

router.post("/", async (req, res) => {
  const { first_name, last_name, email, birth_date, gender } = req.body;

  if (!first_name || !last_name || !email || !birth_date) {
    return res
      .status(400)
      .send({ status: "error", payload: "Missing parameters" });
  }

  const result = await productManager.create({
    first_name,
    last_name,
    email,
    birth_date,
    gender,
  });

  res.status(201).send({ status: "ok", payload: result });
});

export default Router;