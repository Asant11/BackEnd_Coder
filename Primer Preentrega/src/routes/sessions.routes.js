import { Router } from "express";
import  userModel  from "../models/users.models.js";
import { validatePassword } from "../utils/bcrypt.js";
import passport from "passport";

const routerSession = Router();

routerSession.post('/login', passport.authenticate('login'), async (req, res) =>{
    try{
        if(!req.user){
            return res.status(401).send({message: 'Invalid user'})
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email:req.user.email,
            age: req.user.age
        }

        res.status(200).send({payload: req.user})
    } catch(e){
        res.status(500).send({message: `Login error: ${e}`})
    }
})

routerSession.get('/logout', (req, res)=>{
    if(req.session.login){
        try{
            req.session.destroy()
            res.redirect('/api/sessions/login')
        } catch(e){
            res.status(400).send({error: `Logout error: ${e}`})
        }
    }else{
        res.status(404).send({error: `Session not found: ${e}`})
    }
})

routerSession.get('/github', passport.authenticate('github', {scope: ['user: email']}), async (req, res) =>{
    res.status(200).send({message: 'Created user'})
})

routerSession.get('/githubSession', passport.authenticate('github'), async (req, res) =>{
    req.session.user = req.user
    res.status(200).send({message: 'Created session'})
})

export default routerSession;