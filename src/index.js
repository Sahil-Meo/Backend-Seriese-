import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './db/index.js'


connectDB()