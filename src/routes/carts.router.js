import { Router } from "express";
import { CartManager } from "../dao/index.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const carts = await cartManager.getAll();

  res.send(carts);
});

router.post("/", async (req, res) => {
  const { title, description, teacher } = req.body;

  if (!title || !description || !teacher) {
    return res
      .status(400)
      .send({ status: "error", payload: "Missing parameters" });
  }

  const result = await cartManager.create({
    title,
    description,
    teacher,
    students: [],
  });

  res.status(201).send({ status: "ok", payload: result });
});

router.post("/:courseId/:userId", async (req, res) => {
  const { cartId, productId } = req.params;

  const result = await cartManager.addStudent(cartId, productId);

  res.send({ status: "ok", payload: result });
});

export default router;