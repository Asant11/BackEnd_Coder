import { Router } from "express";
import userController from "../controllers/user.controller.js";

const routerUsers = Router();

routerUsers.get('/', userController.getUsers);

routerUsers.get('/:uid', userController.getUser);

routerUsers.delete('/:uid', userController.deleteUser);

export default routerUsers;