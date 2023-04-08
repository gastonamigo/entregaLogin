import express, { json } from "express"
import { ProductManager, CartManager } from "./dao/index.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars"
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";
import chatModel from "./dao/models/chat.model.js";

const manager = new ProductManager()
const cartManager = new CartManager()

const app = express()
app.use(json())

app.use(express.static(__dirname + '/../public'))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


mongoose.connect(
    "mongodb+srv://gastonamigo:coder1234@servercoder.itp7dkf.mongodb.net/?retryWrites=true&w=majority"
).then(conn => {
    console.log("Connected to DB")
})

const httpServer = app.listen(8080, () => {
    console.log("Server listening on port 8080.")
})

const io = new Server(httpServer)

io.on("connection", async(socket) => {
    console.log("New client connected.")
    
    const chatMessages = await chatModel.findById("")
    io.emit("set-messages", chatMessages.messages)

    socket.on("chat-message", async (data)=>{
        
        const chat = await chatModel.findById("")
        chat.messages.push(data)
        await chat.save()
        io.emit("set-messages", chat.messages)
    })
})

app.use((req, res, next) => {
    req.io = io
    next()
})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

export { manager, cartManager }