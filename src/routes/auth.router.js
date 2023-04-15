import { Router } from "express";
import { UserModel } from "../dao/models/user.model.js";

const AuthRouter = Router();
const ADMIN_EMAIL = "adminCoder@coder.com";

//register
AuthRouter.post("/signup", async(req, res)=>{
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.send(`El usuario ${email} ya está registrado <a href="/login">Iniciar sesión </a>`);
        }

        const newUser = await UserModel.create({ email, password });

        req.session.user = newUser.email;
        req.session.rol = email === ADMIN_EMAIL ? "admin" : "user";
        console.log(req.session);

        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
});

//login
AuthRouter.post("/login", async (req,res) => {
    try {
        const { email, password } = req.body;

        const authorized = await UserModel.findOne({ email, password });

        if (!authorized) {
            return res.send("Usuario o contraseña incorrectos");
        }

        req.session.user = email;
        req.session.rol = email === ADMIN_EMAIL ? "admin" : "user";
        console.log(req.session);

        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error interno del servidor");
    }
});

//logOut
AuthRouter.post("/logout", (req,res) =>{
    req.session.destroy(error => {
        if (error) {
            return res.status(500).send("Error interno del servidor");
        } else {
            return res.redirect("/login");
        }
    });
});

export {AuthRouter}
