import 'dotenv/config';
import mongoose from 'mongoose';
import userModel from '../../src/models/users.models.js';
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

describe('Testing sessions', ()=>{

    let id;

    it('Should create a new user', async function(){
        const newUser = {
            first_name : 'Test name',
            last_name: 'Test last name',
            email: 'test@test.com',
            age: 18,
            password: '123test',
        }

        const response = await userModel.create(newUser)
        id = response._id
        assert.isOk(response._id)
    })

    
    it('Should get all the users', async function(){
        const users = await userModel.find();
        expect(users).to.be.an('array');
    })

    it('Should get the user by its id', async function(){
        const user = await userModel.findById(id);
        expect(user).to.have.property('_id')
    })

    it('Should update the user by its id', async function(){
        const updatedUser = {
            first_name : 'Updated test name',
            last_name: 'Updated test last name',
            email: 'updatedtest@test.com',
            age: 18,
            password: '123test',
        }

        const response = await userModel.findByIdAndUpdate(id, updatedUser)
        expect(response).to.be.an('object')
    })

    it('Should delete the user by its id', async function(){
        const response = await userModel.findByIdAndDelete(id);
        expect(response).to.be.an('object').and.have.property('_id')
    })
})