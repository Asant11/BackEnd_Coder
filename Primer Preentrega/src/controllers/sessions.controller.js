import { generateToken } from "../utils/jwt.js";

const postLogin= async (req,res) =>{
    try{
        if(!req.user){
            return res.status(401).send({message: 'Invalid user'})
        }

        // req.session.user = {
        //     first_name: req.user.first_name,
        //     last_name: req.user.last_name,
        //     email:req.user.email,
        //     age: req.user.age 
        // }

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
        res.status(200).send({payload: req.user})
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

const sessionController = {
    postLogin,
    getCurrent,
    githubUser,
    githubSession,
    getLogout
}

export default sessionController;