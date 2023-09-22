import { Router } from "express";
import  userModel  from "../models/users.models.js";

const routerUsers = Router();

routerUsers.post('/register', async (req, res) =>{
    const {first_name, last_name, email, age, password} = req.body;

    try{
        const response = await userModel.create({first_name, last_name, email, age, password});
        if(response){
            res.redirect('../../static/home')       
        }
    } catch(e){
        res.status(400).send({error: `Error al crear usuario: ${e}`})
    }
})

export default routerUsers;