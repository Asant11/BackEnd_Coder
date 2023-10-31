import productModel from "../models/products.models.js";

const getProducts = async(req, res) =>{

    const {limit, page, sort, filter} = req.query
    
    const fil = filter ? filter : {}
    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : -1

    try{
        const prods = await productModel.paginate({ category: fil }, { limit: lim, page: pag, sort: { price: ord } })
        if(prods){
            res.status(200).send(prods)
        } else{
            res.status(404).send({error: 'Products do not exists'})
        }
        
    } catch (e){
        res.status(500).send({error: `Error al consultar productos: ${e}` })
    }
}

const getProduct = async(req, res) =>{
    const {pid} = req.params; 
    
    try{
        const prod = await productModel.findById(pid)
        prod ? res.status(200).send({result: 'OK', message: prod}) : res.status(404).send({result: 'NOT FOUND', message: prod})
    } catch (e){
        res.status(400).send({error: `Error al consultar producto: ${e}` })
    }
}

const postProduct = async(req, res) =>{
    const {title, description, stock, code, price, category} = req.body

    try{
        const product = await productModel.create({title, description, stock, code, price, category})
        if(product){
            res.status(201).send(product) 
        } 
        res.status(404).send({error: "Producto no encontrado"})
    } catch (e){
        if(e.code == 11000){
            return res.status(400).send({error: 'Duplicated key!'})
        } else{
            res.status(500).send({error: `Error al crear producto: ${e}`})
        }
    }
}

const putProduct = async (req, res) =>{
    const {pid} = req.params; 
    const {title, description, stock, code, price, category, status} = req.body
    try{
        const response = await productModel.findByIdAndUpdate(pid, {title, description, stock, code, price, category, status})
        response ? res.status(200).send({result: 'OK', message: response}) : res.status(404).send({result: 'NOT FOUND', message: response})
    } catch (e){
        res.status(400).send({error: `Error al actualizar producto: ${e}` })
    }
}

const deleteProduct = async(req, res) =>{
    const {pid} = req.params;
    try{
        const response = await productModel.findByIdAndDelete(pid)
        response ? res.status(200).send({result: 'OK', message: response}) : res.status(404).send({result: 'NOT FOUND', message: response})
    } catch (e){
        res.status(400).send({error: `Error al eliminar producto: ${e}` })
    }
}

const productController = {
    getProduct,
    getProducts,
    postProduct,
    putProduct,
    deleteProduct
}

export default productController;