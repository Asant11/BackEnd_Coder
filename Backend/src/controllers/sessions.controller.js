import { generateToken } from "../utils/jwt.js";

const postLogin= async (req,res) =>{
    try{
        if(!req.user){
            return res.status(401).send({message: 'Invalid user'})
        }

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
        res.status(200).send({token})
    } catch(e){
        res.status(500).send({message: `Login error: ${e}`})
    }
}

const getCurrent = async(req, res) =>{
    res.status(200).send(req.user)
}

const githubUser = async (req, res) =>{
    res.status(200).send({message: 'Created user'})
}

const githubSession = async(req, res) =>{
    req.session.user = req.user
    res.status(200).send({message: 'Created session'})
}

const getLogout = async(req, res) =>{
    if(req.session){
        req.session.destroy()
        res.clearCookie('jwtCookie')
        res.redirect('/api/sessions/login')
    }else{
    res.status(404).send({error: `Session not found: ${e}`})
    }
}

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

const sessionController = {
    postLogin,
    postUser,
    getCurrent,
    githubUser,
    githubSession,
    getLogout
    
}

export default sessionController;