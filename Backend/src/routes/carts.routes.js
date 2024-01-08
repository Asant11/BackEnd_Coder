import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";

const routerCart = Router();

routerCart.get('/', cartController.getCarts)

routerCart.get('/:cid', cartController.getCart)

routerCart.post('/:cid/product/:pid', passportError('jwt'), authorization('user'),cartController.postProductToCart)

routerCart.post('/:cid', passportError('jwt'), authorization('user'), cartController.cartPurchase)

routerCart.put('/:cid', authorization('user'), cartController.updateCartProducts)

routerCart.put('/:cid/product/:pid', passportError('jwt'), authorization('user'),cartController.updateQuantity)

routerCart.delete('/:cid/product/:pid',  cartController.deleteProductFromCart)

routerCart.delete('/:cid',  cartController.deleteCartProducts)

export default routerCart;