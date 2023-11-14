import {v4 as uuidv4} from 'uuid'
import ticketModel from "../models/tickets.models.js";
import logger from '../utils/logger.js';


const getTickets = async(req, res) =>{
    try{
        const response = await ticketModel.find()
        res.status(200).send({response: response})
    } catch(e){
        logger.error(e)
        res.status(400).send({error: `Error getting tickets: ${e}`})
    }
}

const createTicket = async(req, res) =>{
    
    const {amount, email} = req.query
    
    try{
        const ticket = {
            code: uuidv4(),
            amount: amount,
            purchased_at: new Date().toDateString(),
            purchaser: email 
        }
        await ticketModel.create(ticket)
        const newTicket = ticketModel.findOne({code: ticket.code})
        res.status(201).send({response: 'Created ticket successfully', message: newTicket})
    } catch(e){
        logger.error(e)
        res.status(400).send({error: `Error al crear el ticket: ${e}`})
    }
}

const ticketController = {
    getTickets,
    createTicket
}
export default ticketController;