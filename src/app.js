import express, {urlencoded} from "express";
import { ProductManager, CartManager } from "./dao/index.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";
import chatModel from "./dao/models/chat.model.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import {AuthRouter} from "./routes/auth.router.js";
import cookieParser from "cookie-parser";


const manager = new ProductManager();
const cartManager = new CartManager();
const app = express();
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const port = 8080;
const database = "mongodb+srv://gastonamigo:coder1234@servercoder.itp7dkf.mongodb.net/?retryWrites=true&w=majority";



app.use(express.static(__dirname + '/../public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


mongoose.connect(database).then(conn => {
    console.log("Connected to DB");
});

const httpServer = app.listen(port, () => {
    console.log("Server listening on port 8080.")
});

const io = new Server(httpServer);

io.on("connection", async(socket) => {
    console.log("New client connected.");
    
    const chatMessages = await chatModel.findById("");
    io.emit("set-messages", chatMessages.messages);

    socket.on("chat-message", async (data)=>{
        
        const chat = await chatModel.findById("");
        chat.messages.push(data);
        await chat.save();
        io.emit("set-messages", chat.messages);
    });
});
app.use (session({
    store:MongoStore.create({
        mongoUrl:database,
    }),
    secret:"clave secreta",
    resave:true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", AuthRouter);
export { manager, cartManager };