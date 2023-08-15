import path from 'path';
import express from 'express';
import routerProd from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import {__dirname} from './path.js'





const app = express();
const PORT = 4000;

//Permite el uso de queries complejas para filtrar con varios parametros
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api/products', routerProd)
app.use('/api/carts', routerCarts)


app.get('/', (req, res) => {
    res.send('Esta es la pagina inicial')
})

//Pagina error 404
app.get('*', (req, res) =>{
    res.send('Error 404: Page not found');
})


//Correr el servidor
app.listen(PORT, () =>{
    console.log(`Corriendo el servidor en el puerto ${PORT}`);
})

