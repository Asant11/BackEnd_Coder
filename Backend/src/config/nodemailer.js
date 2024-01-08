import nodemailer from 'nodemailer'
import logger from '../utils/logger.js'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure: true,
    auth:{
        user: 'agustinsantisi92@gmail.com',
        pass: process.env.PASSWORD_MAIL,
        authMethod: 'LOGIN'
    }
})

//Funciones de nodemailer

export const sendRecoveryEmail = (email, recoveryLink) =>{
    const mailOptions = {
        from: 'agustinsantisi92@gmail.com',
        to: email,
        subject: 'Link de recuperación de contraseña',
        text: `Hace click en este enlace para cambiar tu contraseña ${recoveryLink}`
    }

    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            logger.error(error)
        } else{
            logger.info('Email enviado correctamente')
        }
    })
}
