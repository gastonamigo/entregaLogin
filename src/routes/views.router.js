import { json, Router } from "express";
import { manager } from "../app.js";
import productModel from "../dao/models/product.model.js";
import { UserModel } from "../dao/models/user.model.js";
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

// viewsRouter.get("/login",(req,res)=>{
//   res.render("login");
// });

// viewsRouter.get("/signup",(req,res)=>{
//   res.render("registro");
// });

// viewsRouter.get("/profile",(req,res)=>{
//   console.log(req.session);
//   const userData= req.session;
//   res.render("profile", {userData});
// });
// viewsRouter.get("/", async (req,res) =>{
//   const prods = await productModel.paginate();
//   console.log(prods);
//   res.render("home", {prods});
// })
//todos los productos
// viewsRouter.get("/products",/* authenticate, */async (req,res) =>{
//   // 
//   const usuario = req.session.user;
//   let userDatos = await UserModel.findOne({ email: usuario });
//   let rol;

//   /* Verificar si es Admin o Usuario */
//   const emailEntrada = usuario
//   let email = emailEntrada.toLowerCase()
//   const isAdmin = /admin/.test(email);

//   if (isAdmin) {
//     rol = "Admin";
//   } else {
//     rol = "Usuario";
//   }
//   userDatos = { ...userDatos, rol };
//   const products = await productModel.paginate(
//     {},
//     {
//       limit: 5,
//       lean: true,
//     }
//   );

//   res.render("products", { products, userDatos });
// })
//

export default viewsRouter;
