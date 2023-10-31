import { Router } from "express";
import passport from "passport";
import userController from "../controllers/user.controller.js";

const routerUsers = Router();

routerUsers.get('/', userController.getUser)

export default routerUsers;