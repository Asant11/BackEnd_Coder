import { Router } from "express";
import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js";
import cartController from "../controllers/cart.controller.js";

const routerCart = Router();

routerCart.get('/', cartController.getCarts)


routerCart.get('/:cid', cartController.getCart)

routerCart.post('/', cartController.postCart)

routerCart.post('/:cid/product/:pid', cartController.postProductToCart)

routerCart.put('/:cid', cartController.putCart)

routerCart.put('/:cid/products/:pid', cartController.putProductToCart)

routerCart.delete('/:cid/products/:pid', cartController.deleteProductFromCart)

routerCart.delete('/:cid', cartController.deleteCart)

export default routerCart;