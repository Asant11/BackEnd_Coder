import 'dotenv/config.js'
import swaggerUiExpress from 'swagger-ui-express'
import logger from '../src/utils/logger.js'
import cors from 'cors'
import path from 'path';
import cookieParser from 'cookie-parser'
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { engine } from 'express-handlebars';
import {__dirname} from './path.js'
import { Server } from 'socket.io';
import productModel from './models/products.models.js';
import messageModel from './models/messages.models.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import initializePassport from './config/passport.js';
import router from './routes/main.routes.js';
import errorHandler from './middlewares/errors/errorHandler.js';
import { specs } from './config/swagger.js';


// const whiteList = ['http://127.0.0.1:5173 ']

// const corsOptions = {
//     origin: function (origin, callback){
//         if(whiteList.indexOf(origin) != -1 || origin){
//             callback(null, true)
//         } else{
//             callback(new Error("Denied access"))
//         }
//     }
// }


const app = express();
const PORT = 4000;

mongoose.connect(process.env.MONGO_URL)
.then(() => logger.info("DB Connected"))
.catch((e) => logger.info("Connection error: ", e))

//Correr el servidor
const server = app.listen(PORT, () =>{
    logger.info(`Corriendo el servidor en el puerto ${PORT}`);
})
const io = new Server(server)


//Middlewares
// app.use(cors(corsOptions))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(errorHandler);
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL ,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        
    }),
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


io.on("connection", (socket)=>{
    logger.info('Conexion con socket hecha');

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
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use('/', router)



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

app.get('/static/chat',(req, res) => {
    res.render("chat", {
        title: "Chat",
        rutaCSS: "chat",
        rutaJS: "chat"
    })
})

app.get('/api/sessions/login', (req, res) =>{
    res.render("login",{
        title:"Login",
        rutaCSS: "login",
        rutaJS: "login"
    })
})

app.get('/api/users/register', (req, res) =>{
    res.render("register",{
        title:"Register",
        rutaCSS: "register",
        rutaJS: "register"
    })
})

app.get('/static/profile', (req, res) =>{
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





