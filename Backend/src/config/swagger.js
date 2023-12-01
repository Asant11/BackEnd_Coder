import swaggerJSDoc from 'swagger-jsdoc'
import {__dirname}from '../path.js'


const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentación del curso Backend',
            description: 'API desarrollada para el curso de Coderhouse'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
} 

export const specs = swaggerJSDoc(swaggerOptions)