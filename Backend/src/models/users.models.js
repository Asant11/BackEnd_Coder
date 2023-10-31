import { Schema, model } from "mongoose";
import cartModel from "./carts.models.js";
const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true, 
        index: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.pre('save', async function(next) {
    if(!this.cart){
        try{
            const newCart = await cartModel.create({})
            this.carrito = newCart._id
        }catch(e){
            next(e)
        }
    }
})

const userModel = model('users', userSchema);
export default userModel;