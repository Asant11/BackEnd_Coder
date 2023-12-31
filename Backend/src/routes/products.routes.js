import {Router} from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import productController from "../controllers/product.controller.js";
import { authToken } from "../utils/jwt.js";

const routerProd = Router();


routerProd.get('/', productController.getProducts)

routerProd.get('/:pid', productController.getProduct)

routerProd.get('/mockingproducts', passportError('jwt'), authorization('admin'), productController.mockProducts)

routerProd.post('/', passportError('jwt'), authorization('admin'), productController.postProduct)

routerProd.put('/:pid', passportError('jwt'), authorization('admin'), productController.putProduct)

routerProd.delete('/:pid', passportError('jwt'), authorization('admin'), productController.deleteProduct)

export default routerProd;