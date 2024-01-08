import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js";
import userModel from "../models/users.models.js";
import logger from '../utils/logger.js';

const getCarts = async(req, res) =>{
    const {limit} = req.query;

    try{
        const carts = await cartModel.find().limit(limit);

        carts ? res.status(200).send({result: 'OK', message: carts}) : 
        res.status(404).send('CARTS NOT FOUND')
    } catch(e){
        logger.error(e.message)
        res.status(400).send({error: `Getting carts error: ${e}` });
    }
}


const getCart = async(req, res) =>{
    const {cid} = req.params;
    
    try{
        const cart = await cartModel.findById(cid).populate('products.id_prod')
        let totalPrice = 0;
        for(let prod of cart.products){
            totalPrice += prod.id_prod.price * prod.quantity;
        }

        if(cart){
            res.render("cart",{
                rutaCSS: "cart",
                carts: cart,
                idCart: cid,
                totalPrice: totalPrice
            })
        } else{
            res.status(404).send({result: 'CART NOT FOUND', message: cart});
        }
    } catch(e){
        logger.error(e.message)
        res.status(400).send({error:`Getting cart error: ${e}`});
    }
}

const cartPurchase = async(req, res) =>{
    const {cid} = req.params

    try{
        const products = await productModel.find()
        const cart = await cartModel.findById(cid)

        if(cart){
            const user = await userModel.findOne({ cart: cart._id._id });
            const email = req.user.email;
            let amount = 0;

            const cartProducts = [];
            cart.products.forEach(async item => {
                
                const prodInStock = products.find(prod => prod._id == item.id_prod.toString());

                if(prodInStock.stock >= item.quantity){
                    if (user.rol === 'premium') {
                        amount += prodInStock.price * item.quantity * process.env.PREMIUM_DISCOUNT;
                    } else {
                        amount += prodInStock.price * item.quantity;
                    }
                    prodInStock.stock -= item.quantity
                    prodInStock.save()
                    cartProducts.push(prodInStock.title)
                    await cartModel.findByIdAndUpdate(cid, { products: [] });
                }
            })
            res.redirect( `http://localhost:3000/api/tickets/create?amount=${amount}&email=${email}`);
        } else{
            res.status(404).send({error: 'CART NOT FOUND'})
        }
    } catch(e){
        logger.error(e.message)
        res.status(400).send({error: `Getting cart error ${e}`})
    }
}


const postProductToCart = async (req, res) =>{
    const {cid, pid} = req.params;
    const cart = await cartModel.findById(cid);
    const product = await productModel.findById(pid);

    try{
        if(!product){
            res.status(404).send({result: 'PRODUCT NOT FOUND', message: product});
            return false;
        } 
        if(!cart){
            res.status(404).send({result: 'CART NOT FOUND', message: cart});
            return false;
        } 
            
        const existsProd = cart.products.find(prod => prod.id_prod._id == pid);

        existsProd ? existsProd.quantity ++ : cart.products.push({id_prod: pid, quantity: 1});
        const response = await cartModel.findByIdAndUpdate(cid, cart)     
        if(response){
            res.redirect(`/api/carts/${cid}`) }                                                             
    } catch(e){
        logger.error(e.message)
        res.status(400).send(`Adding product error: ${e}`);
    }   
}

const updateCartProducts= async(req, res) =>{
    const {cid} = req.params;
    const products = req.body;
    try{
        const cart = await cartModel.findById(cid);
        products.forEach(product =>{
            const isProd = cart.products.find(prod => prod.id_prod._id.equals(product.id_prod))
            if(isProd){
                isProd.quantity += product.quantity 
            } else{
                cart.products.push(prod); 
            }
        });
        await cart.save()
        cart ? res.status(200).send({result: 'Cart updated succesfully!', message: cart}) : 
        res.status(404).send({result: 'NOT FOUND', message: cart});
    } catch(e){
        logger.error(e.message)
        res.status(400).send(`Updating cart error: ${e}`);
    }
}

const updateQuantity = async(req, res) =>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    try{
        const cart = await cartModel.findById(cid);
        const product = cart.products.find(prod => prod.id_prod._id == pid);

        if(product){
            product.quantity =+ quantity;
        } else{
            cart.products.push({ id_prod: pid, quantity: quantity });
        }
        await cart.save();
        res.status(200).send({result:'Quantity updated succesfully!', message: cart});
    } catch(e){
        logger.error(e.message)
        res.status(400).send(`Updating cart error: ${e}`);
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
                res.status(200).send({result: 'Product deleted succesfully!', message: cart, deletedProduct})
            } else{
                res.status(404).send({result:'PRODUCT NOT FOUND', message: cart})
            }
        } else{
            res.status(404).send({result:'NOT FOUND', message: cart})
        }
    } catch(e){
        logger.error(e.message)
        res.status(400).send({error: `Deleting product error: ${e}`})
    }
}

const deleteCartProducts = async(req, res) =>{
    const {cid} = req.params;
    try{
        const cart = await cartModel.findById(cid);
        if(cart){
            cart.products = [];
            await cart.save()
            res.status(200).send({result: 'Products deleted succesfully!', message: cart})
        } else{
            res.status(404).send({result: 'CART NOT FOUND', message: cart});
        }
        } catch (e){
            logger.error(e.message)
            res.status(400).send({error: `Deleting products error: ${e}` });
    }
}

const cartController = {
    getCarts,
    getCart,
    cartPurchase,
    postProductToCart,
    updateCartProducts,
    updateQuantity,
    deleteProductFromCart,
    deleteCartProducts
}

export default cartController;
