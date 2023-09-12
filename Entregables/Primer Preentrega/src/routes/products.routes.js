import {Router} from "express";
import { ProductManager } from "../controllers/ProductManager.js";
import productModel from "../models/products.models.js";

// const productManager = new ProductManager('./src/models/products.json');
const routerProd = Router();

routerProd.get('/', async (req, res) =>{
    const {limit, page, sort, query} = req.query
    
    let isSort;
    
    if (sort !='asc' || sort != 'desc'){
        isSort = 0
    } else {
        isSort += 'price', isSort;
    }

    const options = {
		limit: limit || 10,
		page: page || 1,
		sort: isSort
	};
    
    const isQuery = query ? query : {};
    // const products = await productManager.getProducts();
    // const prodLimits = res.send(products.slice(0, limit));
    // res.status(200).send(prodLimits);
    
    try{
        const prods = await productModel.paginate(isQuery, options)
        res.status(200).send({result: 'OK', message: prods})
    } catch (e){
        res.status(400).send({error: `Error al consultar productos: ${e}` })
    }
})

routerProd.get('/:pid', async (req, res) =>{
    const {pid} = req.params; 
    
    // const prod = await productManager.getProductById(pid);
    // prod ? res.status(200).send(prod) : res.status(400).send('El producto solicitado no se encuentra')

    try{
        const prod = await productModel.findById(pid)
        prod ? res.status(200).send({result: 'OK', message: prod}) : res.status(404).send({result: 'NOT FOUND', message: prod})
    } catch (e){
        res.status(400).send({error: `Error al consultar producto: ${e}` })
    }
})

routerProd.post('/', async (req, res) =>{
    const {title, description, stock, code, price, category} = req.body
    
    // const confirmation = await productManager.addProduct(req.body);
    // confirmation ? res.status(200).send('Producto agregado correctamente') : res.status(400).send('Producto ya creado')

    try{
        const response = await productModel.create({title, description, stock, code, price, category})
        res.status(200).send({result: 'OK', message: response}) 
    } catch (e){
        res.status(400).send({error: `Error al crear producto: ${e}`})
    }
})

// routerProd.put('/:pid', async (req, res) =>{
//     const {pid} = req.params;
//     const confirmation = await productManager.updateProduct(pid, req.body);
//     confirmation ? res.status(200).send('Producto actualizado correctamente') : res.status(400).send('Producto no encontrado')
// })

routerProd.put('/:pid', async (req, res) =>{
    const {pid} = req.params; 
    const {title, description, stock, code, price, category, status} = req.body
    try{
        const response = await productModel.findByIdAndUpdate(pid, {title, description, stock, code, price, category, status})
        response ? res.status(200).send({result: 'OK', message: response}) : res.status(404).send({result: 'NOT FOUND', message: response})
    } catch (e){
        res.status(400).send({error: `Error al actualizar producto: ${e}` })
    }
})

// routerProd.delete('/:pid', async (req, res) =>{
//     const {pid} = req.params
//     const confirmation = await productManager.deleteProduct(pid);
//     confirmation ? res.status(200).send('Producto eliminado correctamente') : res.status(400).send('Producto no encontrado')
// })

routerProd.delete('/:pid', async (req, res) =>{
    const {pid} = req.params;
    try{
        const response = await productModel.findByIdAndDelete(pid)
        response ? res.status(200).send({result: 'OK', message: response}) : res.status(404).send({result: 'NOT FOUND', message: response})
    } catch (e){
        res.status(400).send({error: `Error al eliminar producto: ${e}` })
    }
})

export default routerProd;