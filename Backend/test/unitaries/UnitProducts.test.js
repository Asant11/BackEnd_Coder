
import mongoose from 'mongoose';
import productModel from '../../src/models/products.models.js';
import logger  from '../../src/utils/logger.js';
import chai from 'chai';

await mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB is connected");
    })
    .catch((error) => console.log(`Error connecting to Database: ${error}`));

const assert = chai.assert;
const expect = chai.expect

describe('Testing Products', () => {
    beforeEach(function () {
        this.timeout(7000);
    });

    let id;

    it('Should create a new product', async function () {
        const newProduct = {
            title: 'Test product',
            description: 'This is a test product',
            price: 10,
            stock: 500,
            category: 'Testing',
            code: 'test123',
        };
        const result = await productModel.create(newProduct);
        id = result._id;
        assert.ok(result._id);
    });

    it('Should get all the products', async function () {
        const products = await productModel.find();
        expect(products).to.be.an('array')
    });

    it('Should get a product by its id', async function () {
        const product = await productModel.findById(id);
        expect(product).to.have.property('_id')
    });

    it('Should update the product by its id', async function () {
        const updatedProduct = {
            title: 'Test product updated',
            description: 'This is a test product updated',
            price: 20,
            stock: 300,
            category: 'Testing',
            code: 'test123',
        }

        const response = await productModel.findByIdAndUpdate(id, updatedProduct)
        expect(response).to.have.property('_id')
    });

    it('Should delete a product by its id', async function () {
        const response = await productModel.findByIdAndRemove(id);
        expect(response).to.have.property('_id')
    });

});