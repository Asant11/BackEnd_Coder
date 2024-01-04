import { Router } from "express";
import  ticketController  from "../controllers/ticket.controller.js";

const ticketRouter = Router();

ticketRouter.get('/', ticketController.getTickets);

ticketRouter.get('/create', ticketController.createTicket);

export default ticketRouter;


