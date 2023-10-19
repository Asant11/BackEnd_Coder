import messageModel from "../models/messages.models";

const getMessages = async (req, res) =>{
    try{
        const messages = await messageModel.find();
        res.status(200).send({result:'OK', message: messages});
    } catch(e){
        res.status(400).send({error: `Error al mostrar los mensajes: ${e}` });
    }
}

const postMessage = async (req, res) =>{
    const {email, message} = req.body;
    try{
        const response = await messageModel.create({email, message});
        res.status(200).send({result:'OK', message: response});
    } catch (e){
        res.status(400).send({error: `Error al enviar el mensaje: ${e}`});
    }
}

const messageController = {
    getMessages, 
    postMessage
}

export default messageController;