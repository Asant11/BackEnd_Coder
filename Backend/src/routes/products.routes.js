import {Router} from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import productController from "../controllers/product.controller.js";

const routerProd = Router();


routerProd.get('/', productController.getProducts)

routerProd.get('/:pid', productController.getProduct)

routerProd.post('/', passportError('jwt'), authorization('user'), productController.postProduct)

routerProd.put('/:pid',  passportError('jwt'), authorization('admin'), productController.putProduct)

routerProd.delete('/:pid',  passportError('jwt'), authorization('admin'), productController.deleteProduct)

export default routerProd;