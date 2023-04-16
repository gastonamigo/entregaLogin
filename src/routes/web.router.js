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
  try {
    const { limit, page, sort } = req.query
    const products = await manager.getProducts({limit, page, sort})
    response.render("home", { products });
  } catch (error) {
    response.status(500).send({ status: "error", error: `${error}` });
  }
});

webRouter.get("/products",/* authenticate, */async (req,res) =>{
  // 
  const usuario = req.session.user;
  let userDatos = await UserModel.findOne({ email: usuario });
  let rol;

  /* Verificar si es Admin o Usuario */
  const emailEntrada = usuario
  let email = emailEntrada.toLowerCase()
  const isAdmin = /admin/.test(email);

  if (isAdmin) {
    rol = "Admin";
  } else {
    rol = "Usuario";
  }
  userDatos = { ...userDatos, rol };
  const products = await productModel.paginate(
    {},
    {
      limit: 5,
      lean: true,
    }
  );

  res.render("products", { products, userDatos });
})

webRouter.get("/users/signup",(req,res)=>{
    res.render("registro");
});

webRouter.get("/login",(req,res)=>{
    res.render("login");
});


webRouter.get("/users/profile", async (req, res) => {
  try {
    const usuario = req.session.user;
    const user = await UserModel.findOne({ email: usuario });

    if (!user) {
      return res.redirect("/login");
    }

    const isAdmin = /admin/i.test(user.email);
    user.rol = isAdmin ? "admin" : "user";
    req.session.rol = user.rol;
    res.render("profile", { user });
  } catch (error) {
    res.status(500).send({ status: "error", error: `${error}` });
  }
});
export default webRouter