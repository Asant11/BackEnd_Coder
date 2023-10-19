import {Router} from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import productController from "../controllers/product.controller.js";

const routerProd = Router();


routerProd.get('/', productController.getProducts)

routerProd.get('/:pid', productController.getProduct)

routerProd.post('/', passportError('jwt'), authorization('admin'), productController.postProduct)

routerProd.put('/:pid', productController.putProduct)

routerProd.delete('/:pid',  productController.deleteProduct)

export default routerProd;