import { Router } from "express";
import  userModel  from "../models/users.models.js";
import {createHash} from '../utils/bcrypt.js';
import passport from "passport";
import userController from "../controllers/user.controller.js";

const routerUsers = Router();


routerUsers.post('/register', passport.authenticate('register'), userController.postUser
)

routerUsers.get('/', userController.getUser)

export default routerUsers;