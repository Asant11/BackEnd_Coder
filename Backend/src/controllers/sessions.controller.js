import { generateToken } from "../utils/jwt.js";
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import {generateUserErrorInfo} from '../services/errors/info.js'
import logger from '../utils/logger.js';

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
const postLogin= async (req,res) =>{
    try{
        validateUserData(req.user)
        if(!req.user){
            return res.status(401).send({message: 'Invalid user'})
        }

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
        res.status(200).send({token})
    } catch(e){
        logger.error(e)
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
        logger.error(e)
        res.status(404).send({error: `Session not found: ${e}`})
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
        logger.error(e)
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