import 'dotenv/config.js'
import logger from '../utils/logger.js'
import local from 'passport-local';
import passport from 'passport';
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import userModel from '../models/users.models.js';

const LocalStrategy = local.Strategy
const JWTstrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


const initializePassport = () => {

    const cookieExtractor = (req) => {
        const token = req.cookies ? req.cookies.jwtCookie : {};
        return token
    }

    const { fromAuthHeaderAsBearerToken } = ExtractJWT

    passport.use('jwt', new JWTstrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, fromAuthHeaderAsBearerToken()]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            const user = await userModel.findById(jwtPayload.user._id)
            if (!user) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            logger.error(error)
            return done(error)
        }
    }))
    
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body
            try{
                const user = await userModel.findOne({email: email})
                if(user){
                    return done(null, false)
                }
                const passwordHash = createHash(password)
                const userCreated =await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash
                })
                return done(null, userCreated)
            } catch(e){
                logger.error(e.message)
                return done(e)
            }
        }
    ))

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) =>{
        try{
            const user = await userModel.findOne({email: username})
            if(!user){
                return done(null, false)
            }

            if(validatePassword(password, user.password)){
                return done(null, user)
            }

            return done(null, false)
        } catch(e){
            logger.error(e.message)
            return done(e)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackUrl: process.env.CALLBACK_URL   
    }, async(accessToken, refreshToken, profile, done) =>{
        try{
            logger.info(accessToken)
            logger.info(refreshToken)
            const user = await userModel.findOne({email: profile._json.email})

            if (!user) {
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18, //Edad por defecto,
                    password: 'password'
                })
                done(null, userCreated)

            } else {
                done(null, user)
            }
        }catch(e){
            logger.error(e.message)
            done(e)
        }
        
    }))

    //Iniciar la sesión del user
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Eliminar la sesión del user
    passport.deserializeUser(async(id, done) =>{
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport;