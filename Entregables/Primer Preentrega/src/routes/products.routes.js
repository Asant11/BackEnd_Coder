import { ProductManager } from "../controllers/ProductManager.js";
import {Router} from "express";


const productManager = new ProductManager('./src/models/products.json');
const routerProd = Router();

routerProd.get('/', async (req, res) =>{
    const {limit} = req.query
    const products = await productManager.getProducts();
    const prodLimits = res.send(products.slice(0, limit));
    res.status(200).send(prodLimits);
})

routerProd.get('/:pid', async (req, res) =>{
    const {pid} = req.params; 
    const prod = await productManager.getProductById(pid);
    prod ? res.status(200).send(prod) : res.status(400).send('El producto solicitado no se encuentra')
})

routerProd.post('/', async (req, res) =>{
    const confirmation = await productManager.addProduct(req.body);
    confirmation ? res.status(200).send('Producto agregado correctamente') : res.status(400).send('Producto ya creado')
})

routerProd.put('/:pid', async (req, res) =>{
    const {pid} = req.params;
    const confirmation = await productManager.updateProduct(pid, req.body);
    confirmation ? res.status(200).send('Producto actualizado correctamente') : res.status(400).send('Producto no encontrado')
})

routerProd.delete('/:pid', async (req, res) =>{
    const {pid} = req.params
    const confirmation = await productManager.deleteProduct(pid);
    confirmation ? res.status(200).send('Producto eliminado correctamente') : res.status(400).send('Producto no encontrado')
})

export default routerProd;