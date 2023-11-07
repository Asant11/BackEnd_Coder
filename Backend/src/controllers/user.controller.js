import userModel from "../models/users.models.js";
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import {generateUserErrorInfo} from '../services/errors/info.js'

const validateUserData = (user) =>{
    const requiredFields = ['first_name', 'last_name', 'email', 'age', 'password']

    for(let field of requiredFields){
        if(!user[field]){
            throw CustomError.createError({
                name: 'User validation error',
                cause: generateUserErrorInfo({first_name, last_name, email, age, password}),
                message: 'Error trying to validate user',
                code: EErrors.MISSING_FIELDS_ERROR
            })
        }
    }
}

const postUser = async(req, res) =>{
    try{
        validateUserData(req.user)
        if(!req.user){
            return res.status(400).send({message: 'User already exists'})
        }
        return res.status(200).send({message: 'User created'})
    } catch(e){
        res.status(500).send({message: `Register error: ${e} `})
    }
}

const getUser = async(req, res) =>{
    try{
        const response = await userModel.find();
        res.status(200).send(response)
    }catch(e){
        res.status(400).send({error: `Error: ${e}`})
    }
}

const userController = {
    postUser,
    getUser
}

export default userController;