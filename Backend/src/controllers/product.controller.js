import productModel from "../models/products.models.js";
import { generateProducts } from "../utils/utils.js";
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import {generateProductErrorInfo} from '../services/errors/info.js'
import logger from '../utils/logger.js';

const getProducts = async(req, res) =>{

    const {limit, page, sort, category} = req.query
    
    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : -1
    
    const query = {}
    if (category) query.category = category

    try{
        const prods = await productModel.paginate(query, { limit: lim, page: pag, sort: { price: ord } })
        if(prods){
            res.status(200).send(prods)
        } else{
            res.status(404).send({error: 'Products do not exists'})
        }
        
    } catch (e){
        logger.error(e.message)
        res.status(500).send({error: `Error al consultar productos: ${e}` })
    }
}

const getProduct = async(req, res) =>{
    const {pid} = req.params; 
    
    try{
        const prod = await productModel.findById(pid)
        prod ? res.status(200).send({result: 'OK', message: prod}) : res.status(404).send({result: 'NOT FOUND', message: prod})
    } catch (e){
        logger.error(e)
        res.status(400).send({error: `Error al consultar producto: ${e}` })
    }
}

const validateProductData = (product) =>{
    const requiredFields = ['title', 'description', 'stock', 'code', 'price', 'category']

    for(let field of requiredFields){
        if(!product[field]){
            throw CustomError.createError({
                name: 'Product validation error',
                cause: generateProductErrorInfo({title, description, stock, code, price, category}),
                message: 'Error trying to validate product',
                code: EErrors.MISSING_FIELDS_ERROR
            })
        }
    }
}

const postProduct = async(req, res) =>{
    const {title, description, stock, code, price, category} = req.body

    try{
        validateProductData(req.body)
        const product = await productModel.create({title, description, stock, code, price, category})
        if(product){
            res.status(201).send(product) 
        } 
        res.status(404).send({error: "Producto no encontrado"})
    } catch (e){
        if(e.code == 11000){
            return res.status(400).send({error: 'Duplicated key!'})
        } else{
            logger.error(e.message)
            res.status(500).send({error: `Error al crear producto: ${e}`})
        }
    }
}

const putProduct = async (req, res) =>{
    const {pid} = req.params; 
    const {title, description, stock, code, price, category, status} = req.body
    try{
        validateProductData(req.body)
        const response = await productModel.findByIdAndUpdate(pid, {title, description, stock, code, price, category, status})
        response ? res.status(200).send({result: 'OK', message: response}) : res.status(404).send({result: 'NOT FOUND', message: response})
    } catch (e){
        logger.error(e.message)
        res.status(400).send({error: `Error al actualizar producto: ${e}` })
    }
}

const deleteProduct = async(req, res) =>{
    const {pid} = req.params;
    try{
        const response = await productModel.findByIdAndDelete(pid)
        response ? res.status(200).send({result: 'OK', message: response}) : res.status(404).send({result: 'NOT FOUND', message: response})
    } catch (e){
        logger.error(e.message)
        res.status(400).send({error: `Error al eliminar producto: ${e}` })
    }
}

const mockProducts = async(req, res) =>{
    let products = [];

    for(let i=0; i<100; i++){
        products.push(generateProducts())
    }
    res.status(200).send({payload: products})
}

const productController = {
    getProduct,
    getProducts,
    postProduct,
    putProduct,
    deleteProduct,
    mockProducts
}

export default productController;