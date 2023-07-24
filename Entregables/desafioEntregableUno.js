
class ProductManager{
    constructor(){
        this.products = []
    }

    //Función para el ID autoincrementable
    getNextID = () => {
        const count = this.products.length
        if(count > 0) {
            const lastProduct = this.products[count-1];
            const id = lastProduct.id + 1;
            return id
        }
        else{
            return 1
        }
    }

    addProduct = (title, description, price, thumbnail, code, stock) =>{
        const id = this.getNextID()
        const validation = this.validateProducts(title, description, price, thumbnail, code, stock)
        const product = {
            id, 
            title,
            description,
            price,
            thumbnail,
            code, 
            stock
        }
        //Código duplicado o campos vacíos no permiten añadir al array
        const duplicatedCode = this.products.some(product => product.code === code)
        !duplicatedCode  && validation == true ? this.products.push(product) : console.log("Producto invalido o ya agregado");
    }   
    
    //Validación de campos obligatorios
    validateProducts = (title, description, price, thumbnail, code, stock) =>{
        if (title == (undefined || '') || description == (undefined || '') || price == (undefined || '') || thumbnail == (undefined || '') || code == (undefined || '') ||stock == (undefined || '')){
            return false
        }
        else{
            return true
        }
    }

    //Muestra el array de productos
    getProducts = () =>{return this.products}

    //Obtener producto por el ID
    getProductsById = (newID) =>{
        const validateID = this.products.find(product => product.id == newID)
        return validateID || console.log("Not Found")
    }
}

const manager = new ProductManager()
console.log(manager.getProducts());
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)
console.log(manager.getProducts());
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)
console.log(manager.getProductsById(1));