
import swaggerUiExpress from 'swagger-ui-express'
import logger from './src/utils/logger.js'
import path from 'path';
import cookieParser from 'cookie-parser'
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { ExpressHandlebars, engine } from 'express-handlebars';
import {__dirname} from './src/path.js'
import { Server } from 'socket.io';
import productModel from './src/models/products.models.js';
import messageModel from './src/models/messages.models.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import initializePassport from './src/config/passport.js';
import router from './src/routes/main.routes.js';
import errorHandler from './src/middlewares/errors/errorHandler.js';
import { specs } from './src/config/swagger.js';



const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGO_URL)
.then(() => logger.info("DB Connected"))
.catch((e) => logger.info("Connection error: ", e))

//Correr el servidor
const server = app.listen(PORT, () =>{
    logger.info(`Corriendo el servidor en el puerto ${PORT}`);
})
const io = new Server(server)


//Middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(errorHandler);
app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))
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
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(express.static('public'));
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


app.get('/static/chat',(req, res) => {
    res.render("chat", {
        title: "Chat",
        rutaCSS: "chat",
        rutaJS: "chat"
    })
})

app.get('/api/session/login', (req, res) =>{
    res.render("login",{
        title:"Login",
        rutaCSS: "login",
        rutaJS: "login"
    })
})

app.get('/api/session/register', (req, res) =>{
    res.render("register",{
        title:"Register",
        rutaCSS: "register",
        rutaJS: "register"
    })

})

//Pagina error 404
app.get('*', (req, res) =>{
    res.send('Error 404: Page not found');
})





