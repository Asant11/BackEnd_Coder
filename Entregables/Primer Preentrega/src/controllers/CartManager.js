import {promises as fs} from 'fs';
import { ProductManager } from './ProductManager.js';
import { v4 as uuidv4 } from 'uuid';

const prodManager = new ProductManager('./src/models/products.json');

export class CartManager{
    constructor(cartsPath, productsPath){
        this.cartsPath = cartsPath;
        this.productsPath = productsPath;
        this.format = 'utf-8';
        this.carts = [];
    }


    getCarts = async() =>{
        this.carts = JSON.parse(await fs.readFile(this.cartsPath, this.format));
        return this.carts;
    }

    getCartById = async(id) =>{
        this.carts = await this.getCarts();
        const findCart = this.carts.find(cart => cart.id === id);
        return findCart ?? console.log('No existe ningún carrito con ese id');
    }

    addCart = async() =>{
        const cartId = uuidv4();
        this.carts = await this.getCarts();

        const newCart = {
            id : cartId,
            products : []
        }

        this.carts.push(newCart);
        await fs.writeFile(this.cartsPath, JSON.stringify(this.carts));
        return newCart;
    }

    addProductToCart = async(pid, cid) =>{
        this.carts = JSON.parse(await fs.readFile(this.cartsPath, this.format))
        const cart = this.carts.find(cart => cart.id === cid) ;

        const products = JSON.parse(await fs.readFile(this.productsPath, this.format));
        const product = products.find(prod => prod.id === pid);

        if(cart){
            const validProd = cart.products.find(prod => prod.id === pid);
            validProd ? validProd.quantity++: cart.products.push({id: product.id, quantity : 1});
            await fs.writeFile(this.cartsPath, JSON.stringify(this.carts));
            return true;
        }
    }

}

