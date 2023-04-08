import { json, Router } from "express";
import { manager } from "../app.js";

const viewsRouter = Router();

// Middleware para parsear JSON en cada solicitud
viewsRouter.use(json());

viewsRouter.get("/", async (request, response) => {
  try {
    const products = await manager.getProducts();
    const viewExists = // Verificar si la vista existe
    response.render("home", { products });
  } catch (error) {
    response.status(500).send({ status: "error", error: `${error}` });
  }
});

viewsRouter.get("/real-time-products-view", async (request, response) => {
  try {
    const products = await manager.getProducts();
    response.render("real-time-products-view", { products });
  } catch (error) {
    response.status(500).send({ status: "error", error: `${error}` });
  }
});

viewsRouter.get("/chat", async (request, response) => {
  response.render("chat");
});

export default viewsRouter;
