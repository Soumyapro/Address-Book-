import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDb } from './connection/connect.js';
import router from './router/router.js';

dotenv.config();
const url = process.env.MONGO_URL;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb(url, app);

app.use('/api', router);