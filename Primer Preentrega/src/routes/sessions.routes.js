import { Router } from "express";
import  userModel  from "../models/users.models.js";

const routerSession = Router();


routerSession.post('/login', async (req, res) =>{
    const {email, password} = req.body  

    try{
        if(req.session.login){
            //res.status(400).send({ resultado: 'Already logged in' });
            res.redirect('../../static/home')
        } else{
            const user = await userModel.findOne({email: email})
            //Admin validation
            user.email === "admin@admin.com" ? req.session.userRole = "admin" : req.session.userRole = "user";
            
            if(user){
                if(user.password == password){
                    req.session.login = true;
                    req.session.email = user.email;
                    //res.status(200).send({result: 'OK', message: user})
                    res.redirect('../../static/home')
                }else{
                    res.status(401).send({result: 'UNAUTHORIZED', message: user})
                }
            } else{
                res.status(404).send({result: 'NOT FOUND', message: user})
            }
        }
        
    } catch(e){
        res.status(400).send({error: `Login error: ${e}`})
    }
})

routerSession.get('/logout', (req, res)=>{
    if(req.session.login){
        try{
            req.session.destroy()
            res.status(200).send({result: 'Logout was successfull'})
        } catch(e){
            res.status(400).send({error: `Logout error: ${e}`})
        }
    }else{
        res.status(404).send({error: `Session not found: ${e}`})
    }
})

export default routerSession;