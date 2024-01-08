
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
const requester = supertest('http://localhost:3000');

describe('App tests', () => {
    let userId = ''
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

    const adminUser = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    }

    it('POST /api/products, should create a new product', async function(){ 
        this.timeout(7000);
        const testProduct = {
            "title": "Arroz",
            "description": "Arroz Oro",
            "price": 250,
            "stock": 40,
            "code": `test${Math.random().toString(34).substring(8)}`,
            "category": "Comida"
        }
        //Admin login
        const {statusCode, header} = await requester.post('/api/session/login').send(adminUser)
        const getToken = header['set-cookie'][0];
        token = {
            name: getToken.split('=')[0],
            value: getToken.split('=')[1]
        };
        expect(statusCode).to.equal(302)
        //Successful login
        if(statusCode == 302){
            const {status, body} = await requester.post('/api/products').send(testProduct).set('Cookie', [`${token.name} = ${token.value}`]);
            expect(status).to.equal(201)
            expect(body.message).have.property('_id')
        }
        
        const product = await productModel.findOne({code: testProduct.code})
        productId = product._id._id
    })

    it('PUT /api/products/:pid, should update the product by its id', async function(){
        const updateProduct = {
            "title": "Carne",
            "description": "Carne de res",
            "price": 250,
            "stock": 40,
            "code": `test${Math.random().toString(34).substring(8)}`,
            "category": "Comida"
        }
        const pid = productId
        const product = await productModel.findById(pid)     
        try{
            if(product){
                const {status, body} = await requester.put(`/api/products/${pid}`).send(updateProduct).set('Cookie', [`${token.name} = ${token.value}`]);          
                expect(status).to.equal(200)
                expect(body.message).have.property('title')
            }
        } catch(e){
            throw new Error(e)
        }
    })

    it('GET /api/products, should get all the products', async function(){
        const {statusCode, body} = await requester.get('/api/products')

        expect(statusCode).to.equal(200)
        expect(body).to.be.an('object')
    })

    it('DELETE /api/products/:pid, should delete the product by its id', async function(){
        const pid = productId;

        const {status, body} = await requester.delete(`/api/products/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]); 
        expect(status).to.equal(200)
        expect(body).to.be.an('object')
    })

    it('GET /api/session/logout, should logout from the site', async function(){
        const {statusCode} = await requester.get('/api/session/logout')

        expect(statusCode).to.equal(302)
    })

    it('POST /api/session/register, should create a new user', async function () {
        this.timeout(7000);

        const { status } = await requester.post('/api/session/register').send(newUser);
        
        const user = await userModel.findOne({ email: newUser.email });

        try{
            if(user){
                expect(status).to.equal(302)
            }
        } catch(e){
            throw new Error(e)
        } 
    });

    it('POST /api/sessions/login, should log in with a registered user', async function () {
        this.timeout(7000);

        const { status, header} = await requester.post('/api/session/login').send(newUser);
        const getToken = header['set-cookie'][0];

        expect(getToken).to.be.ok;
        expect(status).to.be.equal(302);
        
        token = {
            name: getToken.split('=')[0],
            value: getToken.split('=')[1]
        };

        expect(token).to.be.ok;
        expect(token.name).to.be.ok.and.equal('jwtCookie');

        const user = await userModel.findOne({ email: newUser.email });
        userId = user._id;
        cartId = user.cart._id;
    });

    it('GET /api/session/current, should get the current user', async function () {
        const {status} = await requester.get('/api/session/current').set('Cookie', [`jwtCookie=${token.value}`]);

        expect(status).to.be.equal(200)
    });

    it('GET /api/users, should get all the users', async function () {      
        const response = await requester.get('/api/users').set('Cookie', [`jwtCookie=${token.value}`]);

        expect(response).to.be.an('object')
    })

    it('POST /api/carts/:cid/product/:pid, should add a product to the cart', async function () {
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

        const { status } = await requester.put(`/api/carts/${cid}/product/${productId}`).send({ quantity })
        .set('Cookie', [`${token.name} = ${token.value}`]);
        expect(status).to.equal(200);
    });

    

    it('PUT /api/carts/:cid/product/:pid, should modify the quantity of a product in the cart', async function () {
        const cid = cartId;
        const pid = productId;
        const newQty = { quantity : 7 };
        
        const response = await requester.put(`/api/carts/${cid}/product/${pid}`).send(newQty)
        .set('Cookie', [`${token.name} = ${token.value}`]);
        
        const updatedCart = await cartModel.findById(cid);
        const updatedProduct = updatedCart.products.find(product => product.id_prod.toString() === productId.toString());
        
        expect(updatedProduct.quantity).to.equal(7)
    });

    it('DELETE /api/carts/:cid/product/:cid, should delete selected product from the cart', async function (){
        const cid = cartId;
        const pid = productId;
        const {statusCode} = await requester.delete(`/api/carts/${cid}/product/${pid}`).set('Cookie', [`${token.name} = ${token.value}`]); 
        expect(statusCode).to.equal(200)
        const cart = await cartModel.findById(cid)
        const deletedProduct = cart.products.find(product => product.id_prod.toString() === pid.toString());
        expect(deletedProduct).not.be.ok
    })

    it('DELETE /api/carts/:cid, should delete all the products from the cart', async function (){
        const cid = cartId;
        const {status} = await requester.delete(`/api/carts/${cid}`).set('Cookie', [`${token.name} = ${token.value}`]); 

        expect(status).to.equal(200)
        const cart = await cartModel.findById(cid)
        expect(cart.products).to.be.an('array')
    })
    it('DELETE /api/users, should delete the user by its id', async function(){
        const uid = userId;
        const {status} = await requester.delete(`/api/users/${uid}`).set('Cookie', [`${token.name} = ${token.value}`]); 
        expect(status).to.equal(200)
        
        const user = await cartModel.findById(uid)
        expect(user).to.not.be.ok
    })
});