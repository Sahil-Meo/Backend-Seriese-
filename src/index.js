import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './db/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

connectDB()
app = express()
app.use(cors({
     origin: `${process.env.DB_ORIGIN}`,
     credentials: true,
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
     extended: true,
     limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

export { app }