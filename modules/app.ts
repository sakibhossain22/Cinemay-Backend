import express, { Request, Response } from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from '../src/lib/auth';
import cors from 'cors';
import { notFound } from '../src/lib/middlewares/notFound';



const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true
}));

// Api
app.all("/api/auth/*slat", toNodeHandler(auth));





app.get('/', async (req: Request, res: Response) => {
    res.send("Hello Cinemay Server")
})
app.use(notFound)
export default app;
