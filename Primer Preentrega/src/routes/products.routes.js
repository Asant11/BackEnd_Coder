import {Router} from "express";
import productModel from "../models/products.models.js";

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

    try{
        const prods = await productModel.paginate(isQuery, options)
        res.status(200).send({result: 'OK', message: prods})
    } catch (e){
        res.status(400).send({error: `Error al consultar productos: ${e}` })
    }
})

routerProd.get('/:pid', async (req, res) =>{
    const {pid} = req.params; 
    
    try{
        const prod = await productModel.findById(pid)
        prod ? res.status(200).send({result: 'OK', message: prod}) : res.status(404).send({result: 'NOT FOUND', message: prod})
    } catch (e){
        res.status(400).send({error: `Error al consultar producto: ${e}` })
    }
})

routerProd.post('/', async (req, res) =>{
    const {title, description, stock, code, price, category} = req.body

    try{
        const response = await productModel.create({title, description, stock, code, price, category})
        res.status(200).send({result: 'OK', message: response}) 
    } catch (e){
        res.status(400).send({error: `Error al crear producto: ${e}`})
    }
})


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