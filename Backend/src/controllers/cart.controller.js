import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js";
import userModel from "../models/users.models.js";
import logger from '../utils/logger.js';

const getCarts = async(req, res) =>{
    const {limit} = req.query;

    try{
        const carts = await cartModel.find().limit(limit);
        res.status(200).send({result: 'OK', message: carts});
    } catch(e){
        logger.error(e)
        res.status(400).send({error: `Error al consultar el carrito: ${e}` });
    }
}


const getCart = async(req, res) =>{
    const {cid} = req.params;
    
    try{
        const cart = await cartModel.findById(cid);
        cart ? res.status(200).send({result: 'OK', message: cart}) : res.status(404).send({result: 'NOT FOUND', message: cart});
    } catch(e){
        logger.error(e)
        res.status(400).send({error:`Error al encontrar el carrito: ${e}`});
    }
}

const cartPurchase = async(req, res) =>{
    const {cid} = req.params

    try{
        const products = await productModel.find() //Los productos de la BDD
        const cart = await cartModel.findById(cid)

        if(cart){
            //Si existe traigo el usuario asociado a ese carrito
            const user = await userModel.find({ cart: cart._id });
            const email = user[0].email;
            let amount = 0;

            const cartProducts = [];
            //Comparo cada producto de la BDD con los del carrito
            cart.products.forEach(item => {
                const prodInStock = products.find(prod => prod.id == item.id_prod.toString());
                if(prodInStock.stock >= item.quantity){
                    amount += prodInStock.price * item.quantity;
                    prodInStock.stock -= item.quantity
                    prodInStock.save()
                    cartProducts.push(prodInStock.title)
                }
            })
            await cartModel.findByIdAndUpdate(cid, {products: []})
            const data = {
                email : email,
                amount: amount
            }
            res.status(200).send({message:cartProducts, data: data})
        } else{
            res.status(404).send({error: 'Cart not found'})
        }
    } catch(e){
        logger.error(e)
        res.status(400).send({error: `Getting cart error ${e}`})
    }
}

const postCart = async(req, res) =>{
    try{
        const response = await cartModel.create({});
        res.status(200).send({result: 'OK', message: response})
    } catch(e){
        logger.error(e)
        res.status(400).send({error: `Error al crear el carrito: ${e}`})
    }
}

const postProductToCart = async (req, res) =>{
    const {cid, pid} = req.params;
    const cart = await cartModel.findById(cid);
    const product = await productModel.findById(pid);

    try{
        //VALIDACIONES
        if(!product){
            res.status(404).send({result: ' PRODUCT NOT FOUND', message: product});
            return false;
        } 
        if(!cart){
            res.status(404).send({result: 'CART NOT FOUND', message: cart});
            return false;
        } 
            
        const existsProd = cart.products.find(prod => prod.id_prod == pid);

        existsProd ? existsProd.quantity ++ : cart.products.push({id_prod, quantity: 1});
        await cart.save()
        res.status(200).send({result: 'OK', message: cart}) 
    } catch(e){
        logger.error(e)
        res.status(400).send(`Error al agregar el producto: ${e}`);
    }   
}

const putCart= async(req, res) =>{
    const {cid} = req.params;
    const {products} = req.body;

    try{
        const cart = await cartModel.findById(cid);
        products.forEach(prod =>{
            const isProd = cart.products.find(cartProd => cartProd.id_prod == prod.id_prod)
            isProd ? isProd.quantity += prod.quantity : cart.products.push(prod); 
        });
        await cart.save()
        cart ? res.status(200).send({result: 'OK', message: cart}) : res.status(404).send({result: 'NOT FOUND', message: cart});
    } catch(e){
        logger.error(e)
        res.status(400).send(`Error al actualizar el carrito: ${e}`);
    }
}

const putProductToCart = async(req, res) =>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    try{
        const cart = await cartModel.findById(cid);
        const product = cart.products.find(prod => prod.id_prod.toString() === pid);

        if(product){
            product.quantity =+ quantity;
        } else{
            cart.products.push({ id_prod: pid, quantity });
            res.status(404).send({result: 'NOT FOUND', message: cart});
        }
        await cart.save();
        res.status(200).send({result:'OK', message: cart});
    } catch(e){
        logger.error(e)
        res.status(400).send(`Error al actualizar el producto: ${e}`);
    }
}

const deleteProductFromCart = async(req, res) =>{
    const {cid, pid} = req.params;
    try{
        const cart = await cartModel.findById(cid)
        if(cart){
            const prod = cart.products.findIndex(prod => prod.id_prod._id == pid); 
            if(prod != -1){
                const deletedProduct = cart.products.splice(prod, 1);
                await cart.save()
                res.status(200).send({result: 'OK', message: cart, deletedProduct})
            } else{
                res.status(404).send({result:'NOT FOUND', message: cart})
            }
        } else{
            res.status(404).send({result:'NOT FOUND', message: cart})
        }
    } catch(e){
        logger.error(e)
        res.status(400).send({error: `Error al eliminar el producto: ${e}`})
    }
}

const deleteCart = async(req, res) =>{
    const {cid} = req.params;
    try{
        const cart = await cartModel.findByIdAndUpdate(cid, {products:[]});
        await cart.save()
        cart ? res.status(200).send({result: 'OK', message: cart}) : res.status(404).send({result: 'NOT FOUND', message: cart});
    } catch (e){
        logger.error(e)
        res.status(400).send({error: `Error al eliminar productos: ${e}` });
    }
}

const cartController = {
    getCarts,
    getCart,
    postCart,
    cartPurchase,
    postProductToCart,
    putCart,
    putProductToCart,
    deleteProductFromCart,
    deleteCart
}

export default cartController;
