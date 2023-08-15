import {promises as fs} from 'fs';
import { v4 as uuidv4 } from 'uuid';
export class ProductManager{
    constructor(path){
        this.path = path;
        this.format='utf-8';
        this.products = [];
    }


    getProducts = async () =>{
        this.products = JSON.parse(await fs.readFile(this.path, this.format));
        return this.products;
    }

    validateProducts = (title, description, price, category, status, code, stock) =>{
        if (title == (undefined || '') || description == (undefined || '') || price == (undefined || '') 
        ||code == (undefined || '')||status == (undefined || '')||stock == (undefined || '')||category == (undefined || '')){
            return true
        }
        else{
            return false
        }
    }

    addProduct = async (prod) =>{
        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const codeValidation = this.products.find(producto => producto.code === prod.code);
        const validFields = this.validateProducts() ;
        if(codeValidation || validFields){
            return false
        } else {
            prod.id = uuidv4();
            prod.status = true;
            this.products.push(prod)
            
            await fs.writeFile(this.path, JSON.stringify(this.products))
            return true
        } 
    }

    getProductById = async (id) =>{
        this.products = await this.getProducts();
        const validateID = await this.products.find(product => product.id === id)
        return validateID ?? console.log(`"The product with the ID " + ${ID}  + " doesn't exists!"`);
    }

    updateProduct = async (ID, {title, description, price, thumbnail, code, stock, status, category}) =>{
        this.products = JSON.parse(await fs.readFile(this.path, this.format));

        const idx = this.products.findIndex(prod => prod.id === ID)

        if(idx != 1){
            this.products[idx].title = title
            this.products[idx].description = description
            this.products[idx].price = price
            this.products[idx].thumbnail = thumbnail
            this.products[idx].code = code
            this.products[idx].stock = stock
            this.products[idx].status = status
            this.products[idx].category = category

            await fs.writeFile(this.path, JSON.stringify(this.products))
            return this.products;
        } else{
            return false
        }
    }

    deleteProduct = async(id) =>{
        this.products = await this.getProducts()
        const filteredProducts = this.products.filter(product => product.id !== id)
        await fs.writeFile(this.path, JSON.stringify(filteredProducts)) 
        return true;
    } 
}


