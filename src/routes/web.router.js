import {Router,json} from "express";
import { manager } from "../app.js";
import { UserModel } from "../dao/models/user.model.js";
import productModel from "../dao/models/product.model.js";
const webRouter = Router();
webRouter.use(json());
//rutas de las vistas


// webRouter.get("/",(req,res)=>{
//     res.render("login");
// });
webRouter.get("/", async (req, response) => {
     response.render("login");
 
});

webRouter.get("/products",/* authenticate, */async (req,res) =>{
 
  try {
    const usuario = req.session.user;
    const user = await UserModel.findOne({ email: usuario });
    const { limit, page, sort } = req.query
    const products = await manager.getProducts({limit, page, sort})

    if (!user) {
      return res.redirect("/users/login");
    }

    const isAdmin = /admin/i.test(user.email);
    user.rol = isAdmin ? "admin" : "user";
    req.session.rol = user.rol;
    res.render("products", { user, products });
  } catch (error) {
    res.status(500).send({ status: "error", error: `${error}` });
  }
 })

webRouter.get("/users/signup",(req,res)=>{
    res.render("registro");
});

webRouter.get("/users/login",(req,res)=>{
    res.render("login");
});


webRouter.get("/users/profile", async (req, res) => {
  try {
    const usuario = req.session.user;
    const user = await UserModel.findOne({ email: usuario });

    if (!user) {
      return res.redirect("/users/login");
    }

    const isAdmin = /admin/i.test(user.email);
    user.rol = isAdmin ? "admin" : "user";
    req.session.rol = user.rol;
    res.render("profile", { user });
  } catch (error) {
    res.status(500).send({ status: "error", error: `${error}` });
  }
});

export default webRouter;