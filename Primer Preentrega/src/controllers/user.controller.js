import userModel from "../models/users.models.js";

const postUser = async(req, res) =>{
    try{
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