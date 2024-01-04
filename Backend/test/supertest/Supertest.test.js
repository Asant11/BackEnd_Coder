import 'dotenv/config';
import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import logger from '../../src/utils/logger.js';
import productModel from '../../src/models/products.models.js';
import cartModel from '../../src/models/carts.models.js';
import  userModel  from '../../src/models/users.models.js';

await mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        logger.info("MongoDB connected");
    })
    .catch((error) => console.log(`Error connecting to MongoDB Atlas: ${error}`));

const expect = chai.expect;
const requester = supertest('http://localhost:4000');

describe('App tests', () => {
    let cartId = '';
    let productId = '';
    let token = {};

    const newUser = {
        first_name: "Test name",
        last_name: "Test Last_name",
        email: process.env.TEST_USER_EMAIL,
        age: 1234,
        password: process.env.TEST_USER_PASSWORD,
        };

    it('POST /api/sessions/register, should create a new user', async function () {
        this.timeout(7000);

        const { status } = await requester.post('/api/sessions/register').send(newUser);
        
        const user = await userModel.findOne({ email: newUser.email });

        try{
            if(user){
                status == (200) ? expect(status).to.equal(200).and.have.property('_id') : expect(status).to.equal(401);
            }
        } catch(e){
            throw new Error(e)
        }
    });

    it('POST /api/sessions/login, should log in with a registered user', async function () {
        this.timeout(7000);

        const { status, header} = await requester.post('/api/sessions/login').send(newUser);
        const getToken = header['set-cookie'][0];

        expect(getToken).to.be.ok;
        expect(status).to.be.equal(200);
        
        token = {
            name: getToken.split('=')[0],
            value: getToken.split('=')[1]
        };

        expect(token).to.be.ok;
        expect(token.name).to.be.ok.and.equal('jwtCookie');

        const user = await userModel.findOne({ email: newUser.email });
        userId = user._id;
        cartId = user.cart._id;
        logger.info(`The token is: ${token.name} = ${token.value}`); 
    });

    it('GET /api/sessions/current, should get the current user', async function () {
        const {status} = await requester.get('/api/sessions/current').set('Cookie', [`jwtCookie=${token.value}`]);
        logger.info(`Token: ${token.name} = ${token.value}`);

        expect(status).to.be.equal(200)
    });

    it('GET /api/users, should get all the users', async function () {
        
        const response = requester.get('/api/users').set('Cookie', [`jwtCookie=${token.value}`]);

        expect(response).to.be.an('object')
    })

    it('POST /api/carts/:cid/products/:pid, should add a product to the cart', async function () {
        const cid = cartId;
        const newProduct = await productModel.create({
            title:"test product",
            description:"this is a test product",
            price:100,
            stock:500,
            category:"testing",
            code:`test${Math.random().toString(34).substring(8)}`
        });
        productId = newProduct._id;
        const quantity = 2;

        const { status } = await requester.put(`/api/carts/${cid}/products/${productId}`).send({ quantity })
        .set('Cookie', [`${token.name} = ${token.value}`]);

        expect(status).to.equal(200);

        logger.info('Product added succesfully');
    });

    

    it('PUT /api/carts/:cid/products/:pid, should modify the quantity of a product in the cart', async function () {
        const cid = cartId;
        const newQty = { quantity : 7 };
        
        const response = await requester.put(`/api/carts/${cid}/products/${productId}`).send(newQty)
        .set('Cookie', [`${token.name} = ${token.value}`]);
        
        const updatedCart = await cartModel.findById(cid);
        const updatedProduct = updatedCart.products.find(product => product.id_prod.toString() === productId.toString());
        
        expect(updatedProduct.quantity).to.equal(7)

        if(updatedProduct){
            logger.info(`Product quantity successfully updated: ${updatedProduct.quantity}`)
        }else {
            logger.error('Product not found in the updated cart.');
        };
    });

    it('DELETE /api/carts/:cid, should delete all the products from the cart', async function (){
        const cid = cartId;
        const {status} = await requester.delete(`/api/carts/${cid}`).set('Cookie', [`jwtCookie=${token.value}`])

        expect(status).to.equal(200)
    })

});