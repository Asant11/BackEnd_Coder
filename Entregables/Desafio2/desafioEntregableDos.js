const fs = require('fs')
class ProductManager{
    constructor(path){
        this.path = path
        this.format='utf-8'
    }

    getNextID = async () => {
        const products = await this.getProducts()
        const count = products.length;
        return count > 0 ? products[count-1].id + 1 : 1;
    }

    getProducts = async () =>{
        const products = fs.promises.readFile(this.path, this.format)
        return products
            .then(content => JSON.parse(content))
            .catch(e => {if(e) return []})
                
    }

    addProduct = async ( title, description, price, thumbnail, code, stock) =>{
        const id = await this.getNextID()
        return this.getProducts()
            .then(products => {
                products.push({
                    id : id, 
                    title, 
                    description, 
                    price, 
                    thumbnail, 
                    code, 
                    stock})
                return products
            })
            .then(productsNew => fs.promises.writeFile(this.path, JSON.stringify(productsNew)))
            .catch((e) => console.log('ERROR: ', e))
    } 

    getProductsById = async (ID) =>{
        const products = await this.getProducts()
        const validateID = await products.find(product => product.id === ID)
        return validateID ?? console.log(`"The product with the ID " + ${ID}  + " doesn't exists!"`);
    }

    updateProduct = async (newID, field, newData) =>{
        const products = await this.getProducts()
        const updateProduct = products.find(product => product.id === newID)
        updateProduct ?? console.log("The product doesn't exists!");
        
        updateProduct[field] = newData
        fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    deleteProduct = async(id) =>{
        const products = await this.getProducts()
        const filteredProducts = products.filter(product => product.id !== id)
        fs.promises.writeFile(this.path, JSON.stringify(filteredProducts)) 
    } 
}

async function run(){
    // const manager = new ProductManager ('./products.json')
    // console.log(await manager.getProducts()); 
    // console.log(await manager.addProduct('producto prueba 1', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25));
    // console.log(await manager.addProduct('producto prueba 2', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 3', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 4', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 5', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 6', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 7', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 8', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 9', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))
    // console.log(await manager.addProduct('producto prueba 10', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25))

    // // console.log(await manager.getProducts()); 
    // // console.log(await manager.getProductsById(1));
    // // console.log(await manager.updateProduct(1, 'price', 250));
    // console.log(await manager.deleteProduct(2));
}
run()

