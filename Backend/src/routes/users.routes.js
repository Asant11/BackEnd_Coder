import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authorization } from "../utils/messageErrors.js";

const routerUsers = Router();

routerUsers.get('/', userController.getUsers);

routerUsers.get('/:uid', userController.getUser);

export default routerUsers;