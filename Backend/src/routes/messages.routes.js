import { Router } from "express";
import messageController from "../controllers/message.controller.js";
import { passportError, authorization } from "../utils/messageErrors.js";
const routerMessage = Router();

routerMessage.get('/', messageController.getMessages);

routerMessage.post('/', passportError('jwt'), authorization('admin'), messageController.postMessage);

export default routerMessage;