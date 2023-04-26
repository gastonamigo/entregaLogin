import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";


const AuthRouter = Router();

//rutas de auth
AuthRouter.post("/users/signup", passport.authenticate("signupStrategy",{
    failureRedirect: "/api/sessions/failure-signup"
  }), (req, res) => {
    res.send("Usuario registrado");
    return res.redirect("/products")
  });

  AuthRouter.get("/failure-signup", (req, res) => {
    res.send("No fue posible registrar al usuario");
  });

  AuthRouter.get("/github", passport.authenticate("githubSignup"));

  AuthRouter.get("/github-callback", passport.authenticate("githubSignup", {
      failureRedirect: "/api/sessions/failure-signup"
    }), (req, res) => {
        res.send("Usuario autenticado");
      
    }
  );


AuthRouter.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      if(isValidPassword(user, password)){
          req.session.user = user.email;
          return res.redirect("/products");
      }else{
          res.send("Credenciales incorrectas")
      }
  }    
        res.send(`Usuario no encontrado <a href="/users/signup">Registrarte </a>o Volver a <a href="/users/login">loguearte</a>`);
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