import express from "express";
import 'dotenv/config.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";



const app = express();

const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173']


app.use(express.json());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(cookieParser());

//Api endpoint
app.get('/', (req, res)=> res.send('Api is working....'))

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)


app.listen(port, ()=> console.log(`Server Started on port: ${port}`));

