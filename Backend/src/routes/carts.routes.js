import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const routerCart = Router();

routerCart.get('/', cartController.getCarts)


routerCart.get('/:cid', cartController.getCart)

routerCart.post('/', cartController.postCart)

routerCart.post('/:cid/product/:pid', cartController.postProductToCart)

routerCart.post('/:cid/purchase', cartController.cartPurchase)

routerCart.put('/:cid', cartController.putCart)

routerCart.put('/:cid/products/:pid', cartController.putProductToCart)

routerCart.delete('/:cid/products/:pid', cartController.deleteProductFromCart)

routerCart.delete('/:cid', cartController.deleteCart)

export default routerCart;