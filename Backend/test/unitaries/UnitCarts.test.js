
import mongoose from 'mongoose';
import cartModel from '../../src/models/carts.models.js';
import chai from 'chai';

await mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB is connected");
    })
    .catch((error) => console.log(`Error connecting to Database: ${error}`));

const assert = chai.assert;
const expect = chai.expect

describe('Testing carts', () => {
    beforeEach(function () {
        this.timeout(7000);
    });

    let id;

    it('Should create a new cart', async function(){
        const response = await cartModel.create({})
        id = response._id
        assert.isOk(response._id);
    })

    it('Should get all the carts', async function(){
        const carts= await cartModel.find()
        expect(carts).to.be.an('array')
    })

    it('Should get a cart by its id', async function(){
        const cart = await cartModel.findById(id)
        expect(cart).to.have.property('_id')
    })

    it('Should delete the cart by its id', async function(){
        const response = await cartModel.findByIdAndDelete(id)
        expect(response).to.have.property('_id')
    })
})