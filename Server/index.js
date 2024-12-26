/*const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv')
To use the above, goto package.json and add type : "module" below main : "index.js" and above scripts : {...}
*/
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import router from './routes/index.js'

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8000

const allowedOrigins = ['https://expense-manager-3vir.vercel.app'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true, // Allow cookies or Authorization headers
    })
);


app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:true}))

app.use("/api-v1",router)

app.use("*",(req,res) => {
    res.status(404).json({status : "Not Found",
        message : "Route Not Found, failing before route itself"
    })
})

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})
