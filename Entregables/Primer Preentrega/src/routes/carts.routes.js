import { CartManager } from "../controllers/CartManager.js";
import { Router } from "express";

const cartManager = new CartManager('./src/models/carts.json', './src/models/products.json');
const routerCart = Router();

routerCart.get('/', async(req, res) =>{
    const confirmation = await cartManager.getCarts();
    confirmation ? res.status(200).send(confirmation) : res.status(400).send('Carritos no encontrados')
})

routerCart.get('/:cid', async(req, res) =>{
    const {cid} = req.params;
    const findCart = await cartManager.getCartById(cid);
    findCart ? res.status(200).send(findCart) : res.status(400).send('El carrito solicitado no se encuentra');
})

routerCart.post('/', async (req, res) =>{
    const confirmation = await cartManager.addCart();
    confirmation ? res.status(200).send('Carrito creado correctamente') : res.status(400).send('Error al crear el carrito');
})

routerCart.post('/:cid/product/:pid', async(req, res) =>{
    const {cid, pid} = req.params;
    const confirmation = await cartManager.addProductToCart(pid, cid);
    confirmation ? res.status(200).send('Producto agregado al carrito.') : res.status(400).send('No se ha podido agregar el producto.')
})

export default routerCart;