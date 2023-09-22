import { Router } from "express";
import messageModel from "../models/messages.models.js";

const routerMessage = Router();

routerMessage.get('/', async (req, res) => {
    try{
        const messages = await messageModel.find();
        res.status(200).send({result:'OK', message: messages});
    } catch(e){
        res.status(400).send({error: `Error al mostrar los mensajes: ${e}` });
    }
});

routerMessage.post('/', async (req, res)=>{
    const {email, message} = req.body;
    try{
        const response = await messageModel.create({email, message});
        res.status(200).send({result:'OK', message: response});
    } catch (e){
        res.status(400).send({error: `Error al enviar el mensaje: ${e}`});
    }
});

export default routerMessage;