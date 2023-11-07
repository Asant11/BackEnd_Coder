export const generateProductErrorInfo = (product) =>{
    return `One or more properties were incomplete or not valid.
    List of required properties: 
    *title: needs to be an String, received ${product.title}
    *description: needs to be an String, received ${product.description}
    *price: needs to be a number, received ${product.price}
    *stock: needs to be a number, received ${product.stock} 
    *category: needs to be an String, received ${product.category} 
    *code: needs to be an String, received ${product.code} 
    `
}

export const generateUserErrorInfo = (user) =>{
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, received ${user.first_name}
    * last_name : needs to be a String, received ${user.last_name}
    * email : needs to be a String, received ${user.email}`
}