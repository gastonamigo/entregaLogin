import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import { UserModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const initializedPassport = ()=>{
    passport.use("signupStrategy",new LocalStrategy(
        {
            usernameField:"email",
            passReqToCallback:true
        },
        async(req,username, password, done)=>{
            try {
                const {name,age} = req.body;
                const user = await UserModel.findOne({email:username});
                if(user){
                    return done(null,false)
                }
                //si no existe en la db
                const newUser ={
                    name,
                    age,
                    email:username,
                    password:createHash(password)
                };
                const userCreated = await UserModel.create(newUser);
                return done(null,userCreated);
            } catch (error) {
                return done(error);
            }
        }
    ));

    //Estrategia para autenticar a los usuarios a traves de github
    passport.use("githubSignup", new GithubStrategy(
        {
            clientID: "Iv1.8132c9e9f2484659",
            clientSecret: "412a8a7aeaacf9ca9d55b15a7cf18b81aaecd635",
            callbackURL: "http://localhost:8080/api/sessions/github-callback"
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                // console.log("profile", profile)
                const userExists = await UserModel.findOne({email:profile.username});
                if(userExists){
                    return done(null,userExists)
                }
                const newUser = {
                    name:profile.displayName,
                    age:null,
                    email:profile.username,
                    password:createHash(profile.id)
                };
                const userCreated = await UserModel.create(newUser);
                return done(null,userCreated)
            } catch (error) {
                return done(error)
            }
        }
    ))

    //serializar y deserializar usuarios
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });

    passport.deserializeUser(async(id,done)=>{
        const user = await UserModel.findById(id);
        return done(null, user);//req.user = user
    });
}

export {initializedPassport}