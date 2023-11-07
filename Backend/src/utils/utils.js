import {faker} from '@faker-js/faker'

export const generateProducts = () =>{
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.string.numeric(),
        category: faker.commerce.productAdjective(),
        status: faker.datatype.boolean(),
        code: faker.string.numeric(6)
    }
}