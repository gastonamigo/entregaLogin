import { json, Router } from "express";
import { manager } from "../app.js";

const viewsRouter = Router();

// Middleware para parsear JSON en cada solicitud
viewsRouter.use(json());

viewsRouter.get("/", async (req, response) => {
  try {
    const { limit, page, sort } = req.query
    const products = await manager.getProducts({limit, page, sort})
    response.render("home", { products });
  } catch (error) {
    response.status(500).send({ status: "error", error: `${error}` });
  }
});

viewsRouter.get("/real-time-products-view", async (req, response) => {
  try {
    const products = await manager.getProducts({});
    response.render("real-time-products-view", { products });
  } catch (error) {
    response.status(500).send({ status: "error", error: `${error}` });
  }
});

viewsRouter.get("/chat", async (req, response) => {
  response.render("chat");
});

viewsRouter.get("/login",(req,res)=>{
  res.render("login");
});

viewsRouter.get("/signup",(req,res)=>{
  res.render("registro");
});

viewsRouter.get("/profile",(req,res)=>{
  console.log(req.session);
  const userData= req.session;
  res.render("profile", {userData});
});
viewsRouter.get("/", async (req,res) =>{
  const prods = await productModel.paginate();
  console.log(prods);
  res.render("index", {prods});
})
//todos los productos
viewsRouter.get("/products", authenticate, async (req,res) =>{
  console.log(`esto se ve desde prods${req.session.user}`);
  const {page} =req.query;
  const prods = await  productModel.paginate(
      {},{limit: 10, lean:true, page: page??1}
  );
  const userData = req.session.user;
  res.render("products", {prods, userData});
})
//middle se aut
async function authenticate(req, res, next) {
  console.log(`esto se ve desde midd ${req.session.rol}`);
  if (req.session.rol === "admin") {
      return next();
    }else{
      res.send("no tienes acceso, esta es un area solo para admin");
    }
}

export default viewsRouter;
