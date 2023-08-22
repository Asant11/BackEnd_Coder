import path from 'path';
import express from 'express';
import { engine } from 'express-handlebars';
import routerProd from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import {__dirname} from './path.js'
import { Server } from 'socket.io';
import { ProductManager } from './controllers/ProductManager.js';




const prodManager = new ProductManager('./src/models/products.json')
const app = express();
const PORT = 4000;

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


io.on("connection", (socket)=>{
    console.log('Conexion con socket hecha');

    socket.on('newProduct', async (prod)=>{
        await prodManager.addProduct(prod);
        socket.emit('newProductMsg', 'El producto fue creado correctamente')
    })

    socket.on('deleteProduct', (id) =>{
        prodManager.deleteProduct(id);
        socket.emit('deleteMsg', 'Producto eliminado correctamente..')
    })

    socket.on('load', async()=>{
        const products = await prodManager.getProducts();
        socket.emit('getProducts', products );
    })
})


//Routes
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api/products', routerProd)
app.use('/api/carts', routerCarts)
//Handlebars routes

app.use('/static/realTimeProducts', (req, res) => {
    res.render("realTimeProducts", {
        title: "Real Time Users",
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })
})

app.use('/static', (req, res) => {
    res.render("home", {
        title: "Home",
        rutaCSS: "home",
        rutaJS: "home"
    })
})


app.get('/', (req, res) => {
    res.send('Esta es la pagina inicial')
})

//Pagina error 404
app.get('*', (req, res) =>{
    res.send('Error 404: Page not found');
})



