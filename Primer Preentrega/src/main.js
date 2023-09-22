import 'dotenv/config.js'
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import {__dirname} from './path.js'
import { Server } from 'socket.io';
// import { ProductManager } from './controllers/ProductManager.js';
import productModel from './models/products.models.js';
import messageModel from './models/messages.models.js';
import routerProd from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import routerMessage from './routes/messages.routes.js';
import routerSession from './routes/sessions.routes.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import routerUsers from './routes/users.routes.js';




// const prodManager = new ProductManager('./src/models/products.json')
const app = express();
const PORT = 4000;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connected"))
.catch((e) => console.log("Connection error: ", e))

//Correr el servidor
const server = app.listen(PORT, () =>{
    console.log(`Corriendo el servidor en el puerto ${PORT}`);
})
const io = new Server(server)


//Permite el uso de queries complejas para filtrar con varios parametros
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL ,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        
    }),
}));


io.on("connection", (socket)=>{
    console.log('Conexion con socket hecha');

    socket.on('newProduct', async (prod)=>{
        await productModel.create(prod);
        socket.emit('newProductMsg', 'El producto fue creado correctamente')
    })

    socket.on('deleteProduct', (id) =>{
        productModel.findByIdAndDelete(id);
        socket.emit('deleteMsg', 'Producto eliminado correctamente..')
    })

    socket.on('load', async()=>{
        const products = await productModel.find().lean();
        socket.emit('getProducts', products );
    })

    socket.on('mensaje', async (info) => {
		const { email, message } = info;
		await messageModel.create({
			email,
			message,
		});
		const messages = await messageModel.find();

		io.emit('mensajes', messages);
	});

})


//Routes
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api/products', routerProd)
app.use('/api/carts', routerCarts)
app.use('/api/messages', routerMessage)
app.use('/api/sessions', routerSession)
app.use('/api/users', routerUsers)


//Handlebars routes

app.get('/static/realTimeProducts', (req, res) => {
    res.render("realTimeProducts", {
        title: "Real Time Users",
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })
})

app.get('/static/home', (req, res) => {
    res.render("home", {
        title: "Home",
        rutaCSS: "home",
        rutaJS: "home"
    })
})

app.get('/static/chat', (req, res) => {
    res.render("chat", {
        title: "Chat",
        rutaCSS: "chat",
        rutaJS: "chat"
    })
})

app.get('/api/sessions/login', (req, res)=>{
    res.render("login",{
        title:"Login",
        rutaCSS: "login",
        rutaJS: "login"
    })
})

app.get('/api/users/register', (req, res)=>{
    res.render("register",{
        title:"Register",
        rutaCSS: "register",
        rutaJS: "register"
    })
})

app.get('/static/profile', (req, res)=>{
    res.render("profile",{
        title: "Profile",
        rutaCSS: "profile",
        rutaJS: "profile"
    })
})


app.get('/', (req, res) => {
    res.send('Esta es la pagina inicial')
})

//Pagina error 404
app.get('*', (req, res) =>{
    res.send('Error 404: Page not found');
})





