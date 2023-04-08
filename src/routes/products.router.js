import { json, Router } from "express";
import { manager } from "../app.js";

const productsRouter = Router()

productsRouter.use(json())

productsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query
    const products = await manager.getProducts({ limit: limit })

    if (limit) {
      const productsLimit = products.slice(0, limit)
      return res.status(200).json({ status: "success", payload: productsLimit })
    }

    res.status(200).json({ status: "success", payload: products })
  } catch (err) {
    res.status(500).json({ status: "error", error: `${err}` })
  }
})

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params
    const product = await manager.getProductById(pid)

    res.status(200).json({ status: "success", payload: product })
  } catch (err) {
    res.status(500).json({ status: "error", error: `${err}` })
  }
})

productsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbail = [],
      status = true
    } = req.body

    const newProduct = {
      title,
      description,
      price: parseInt(price),
      code,
      stock: parseInt(stock),
      category,
      thumbail,
      status
    }
   

  
    const addedProduct = await manager.addProduct(newProduct);

    req.io.emit("new-product", addedProduct)
    

    res.status(201).json({ status: "success", payload: addedProduct })
  } catch (err) {
    res.status(500).json({ status: "error", error: `${err}` })
  }
})

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params
    const updatedProduct = await manager.updateProduct(pid, req.body)

    const products = await manager.getProducts()

    req.io.emit("update-product", products)

    res.status(200).json({ status: "success", payload: updatedProduct })
  } catch (err) {
    res.status(500).json({ status: "error", error: `${err}` })
  }
})

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params
    await manager.deleteProduct(pid)

    const products = await manager.getProducts()

    req.io.emit("delete-product", products)

    res.status(200).json({ status: "success", payload: "Product deleted" })
  } catch (err) {
    res.status(500).json({ status: "error", error: `${err}` })
  }
})

export default productsRouter
