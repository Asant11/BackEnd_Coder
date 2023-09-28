import { Router } from "express";
import  userModel  from "../models/users.models.js";
import {createHash} from '../utils/bcrypt.js';
import passport from "passport";

const routerUsers = Router();


routerUsers.post('/register', passport.authenticate('register') ,async (req, res) =>{
    try{
        if(!req.user){
            return res.status(400).send({message: 'User already exists'})
        }
        return res.status(200).send({message: 'User created'})
    } catch(e){
        res.status(500).send({message: `Register error: ${e} `})
    }
})

export default routerUsers;