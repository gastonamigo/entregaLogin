import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";

const AuthRouter = Router();
const ADMIN_EMAIL = "adminCoder@coder.com";

AuthRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      const newUser = await UserModel.create({ email, password });
      req.session.user = newUser.email;
      req.session.rol = "user";

      if (email === ADMIN_EMAIL) {
        req.session.rol = "admin";
        console.log(req.session);
      }

      return res.redirect("/products");
    } else {
      res.status(400).json({ message: "El usuario ya se encuentra registrado." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Hubo un error en el servidor." });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const authorized = await UserModel.findOne({ email: email, password: password });
  if (!authorized) {
    res.status(401).json({ message: "Usuario o contraseña incorrectos." });
  } else {
    if (email === ADMIN_EMAIL) {
      req.session.user = email;
      req.session.rol = "admin";
      console.log(req.session);
    } else {
      req.session.user = email;
      req.session.rol = "user";
    }
    return res.redirect("/products");
  }
});

AuthRouter.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ message: "No se pudo cerrar la sesión." });
    } else {
      res.redirect("/login");
    }
  });
});

export { AuthRouter };
