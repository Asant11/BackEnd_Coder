import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js";

const getCarts = async(req, res) =>{
    const {limit} = req.query;

    try{
        const carts = await cartModel.find().limit(limit);
        res.status(200).send({result: 'OK', message: carts});
    } catch(e){
        res.status(400).send({error: `Error al consultar el carrito: ${e}` });
    }
}


const getCart = async(req, res) =>{
    const {cid} = req.params;
    
    try{
        const cart = await cartModel.findById(cid);
        cart ? res.status(200).send({result: 'OK', message: cart}) : res.status(404).send({result: 'NOT FOUND', message: cart});
    } catch(e){
        res.status(400).send({error:`Error al encontrar el carrito: ${e}`});
    }
}

const postCart = async(req, res) =>{
    try{
        const response = await cartModel.create({});
        res.status(200).send({result: 'OK', message: response})
    } catch(e){
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
        res.status(400).send({error: `Error al eliminar productos: ${e}` });
    }
}

const cartController = {
    getCarts,
    getCart,
    postCart,
    postProductToCart,
    putCart,
    putProductToCart,
    deleteProductFromCart,
    deleteCart
}

export default cartController;
