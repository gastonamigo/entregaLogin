import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";

const AuthRouter = Router();

//rutas de auth
AuthRouter.post("/users/signup", async (req, res) => {
  try {
    const { email, password, last_name, first_name, age } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      //si no existe el usuario lo registramos
      const newUser = await UserModel.create({
        email,
        password,
        age,
        last_name,
        first_name,
      });
      req.session.user = newUser.email;
      return res.redirect("/products");
    }

    //si ya existe enviamos un mensaje que el usuario ya existe
    res.send(`Usuario ya registrado <a href="/">Incia sesion</a>`);
  } catch (error) {
    console.log(error);
  }
});

AuthRouter.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    
    if (user) {
      
      if (password == user.password) {
        req.session.user = user.email;
        return res.redirect("/products");
      } else {
        res.send(`Contraseña incorrecta <a href="/login">Intentar de nuevo</a>`);
      }
    } else {
      //si no existe el usuario
      if (!email) {
        res.send(`Debe ingresar un correo electrónico <a href="/login">Intentar de nuevo</a>`);
      } else {
        res.send(`Usuario no encontrado <a href="/users/registro">Registrarte</a>o Volver a <a href="/login">loguearte</a>`);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

AuthRouter.get("/users/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send("La sesion no se pudo cerrar");
    console.log("Session destroy");
    res.redirect("/");
  });
});

export default AuthRouter;