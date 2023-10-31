import { Schema, model } from "mongoose";


const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    purchased_at:{
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
    
})



const ticketModel = model('tickets', ticketSchema)

export default ticketModel;