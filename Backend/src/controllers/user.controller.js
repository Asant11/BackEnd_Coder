import userModel from "../models/users.models.js";
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import {generateUserErrorInfo} from '../services/errors/info.js'


const getUsers = async(req, res) =>{
    try{
        const response = await userModel.find();
        res.status(200).send(response)
    }catch(e){
        res.status(400).send({error: `Error: ${e}`})
    }
}

const getUser = async(req, res) =>{
    const {uid} = req.params;

    try{
        const response = await userModel.findById(uid)
        uid ? res.status(200).send(response) : res.status(401).send({message: 'USER NOT FOUND'})
    }catch(e){
        res.status(400).send({error: `Error: ${e}`})
    }
}

const userController = {
    getUsers,
    getUser
}

export default userController;