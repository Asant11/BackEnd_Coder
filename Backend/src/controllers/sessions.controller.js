import { generateToken } from "../utils/jwt.js";
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import {generateUserErrorInfo} from '../services/errors/info.js'
import logger from '../utils/logger.js';
import userModel from "../models/users.models.js";
import crypto from 'crypto'
import { sendRecoveryEmail } from '../config/nodemailer.js'
import {validatePassword, createHash} from '../utils/bcrypt.js'

const recoveryLinks = {};
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
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email:req.user.email,
            age: req.user.age
        }
        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
        res.status(200).send({token})
    } catch(e){
        logger.error(e.message)
        res.status(500).send({message: `Login error: ${e}`})
    }
}

const passwordRecovery = async (req, res) =>{
    const {email} = req.body;
    const validateUser = await userModel.findOne({email : email});
    
    try{
        if(validateUser){
            const token = crypto.randomBytes(20).toString('hex')
            
            recoveryLinks[token] = {email, timestamp: Date.now()}

            const recoveryLink = `http://localhost:8000/api/sessions/reset-password/${token}`
            
            sendRecoveryEmail(email, recoveryLink)

            res.status(200).send('Recovery email was sent succesfully')
        } else{
            res.status(404).send('There is no user with that email registered')
        }
    }catch(e){
        logger.error(e.message)
        res.status(400).send(`Getting new password error: ${e}`)
    }   
}

const resetPassword = async(req, res) =>{
    const {token} = req.params;
    const {newPass} = req.body;

    const linkData = recoveryLinks[token];
    try{
        if (linkData && Date.now() - linkData.timestamp <= 3600000 ){
            const {email} = linkData;
            const user = await userModel.findOne({email: email})    
            const passValidation = validatePassword(newPass, user.password)
            if(passValidation){
                logger.error('The passwords are the same')
                res.status(400).send('The new password is the same to the old password')
            } else{
                user.password = createHash(newPass)
                await user.save();
                delete recoveryLinks[token]
                logger.info('Password recovery was successfully')
                res.status(200).send('Password recovery was successfully')
            }
        } else{
            res.status(400).send('Invalid or expired token. Try again with another link.')
        }
    }catch(e){
        logger.error(e.message)
        res.status(400).send(`Resetting password error: ${e}`)
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
        logger.error(e.message)
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
        logger.error(e.message)
        res.status(500).send({message: `Register error: ${e} `})
    }
}

const sessionController = {
    postLogin,
    postUser,
    getCurrent,
    githubUser,
    githubSession,
    getLogout,
    passwordRecovery,
    resetPassword
}

export default sessionController;