import { json, Router } from "express";
import { cartManager, manager } from "../app.js";

const cartsRouter = Router();
cartsRouter.use(json());

//routes carts

cartsRouter.post("/", async (req, res) => {
  try {
    const addedCart = await cartManager.addCart();
    res.status(201).send({ status: "succes", payload: addedCart });
  } catch (err) {
    res.status(404).send({ status: "error", error: `${err}` });
  }
});

cartsRouter.get("/", async (req, res) => {
  try {
    let carts = await cartManager.getCarts();
    res.send({ status: "success", payload: carts });
  } catch (err) {
    res.status(404).send({ status: "error", error: `${err}` });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    let cart = await cartManager.getCartProducts(cid);
    res.send({ status: "succes", payload: cart });
  } catch (err) {
    res.status(404).send({ status: "error", error: `${err}` });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let product = await manager.getProductById(pid);
    let addedToCart = await cartManager.addProductToCart(product, cid);

    res.status(201).send({
      status: "succes",
      payload: await cartManager.getCartProducts(cid),
    });
  } catch (err) {
    res.status(404).send({ status: "error", error: `${err}` });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.deleteProductInCart(cid, pid);
    res.send({
      status: "succes",
      payload: `One unit of product: ${pid} in cart: ${cid} was removed`,
    });
  } catch (err) {
    res.status(404).send({ status: "error", error: `${err}` });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { product_list } = req.body;
    const updatedCart = await cartManager.addProductListToCart(
      cid,
      product_list
    );
    res.send({ status: "succes", payload: updatedCart });
  } catch (err) {
    res.status(404).send({ status: "error", error: err.message });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartManager.moreQuantity(cid, pid, quantity);

    res.send({ status: "succes", payload: "Quantity Updated." });
  } catch (err) {
    res.status(404).send({ status: "error", error: err.message });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.clearCart(cid);
    res.send({ status: "succes", payload: result });
  } catch (err) {
    res.status(404).send({ status: "error", error: err.message });
  }
});

export default cartsRouter;