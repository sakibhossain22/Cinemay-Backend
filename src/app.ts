import express, { Request, Response } from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
import { notFound } from './lib/middlewares/notFound';
import { paymentRoutes } from './payment/payment.routes';
import { userRoutes } from './user/user.routes';
import { watchListRoutes } from './watchlist/watchlist.routes';
import { reviewRoutes } from './review/review.routes';
import { mediaRoutes } from './media/media.routes';
import { adminRoutes } from './admin/admin.routes';
import { authRoutes } from './auth/auth.routes';
import cookieParser from 'cookie-parser';
import { commentRoutes } from './comment/comment.routes';
import { purchaseRoutes } from './purchase/purchase.routes';
import { HistoryRoutes } from './history/history.routes';



const app = express();
app.use(cookieParser())

app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Api


app.all("/api/auth/*slat", toNodeHandler(auth));

app.use("/api/media", mediaRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/watchlist", watchListRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/history", HistoryRoutes);
app.use("/api/authentication", authRoutes);



app.get('/', async (req: Request, res: Response) => {
    res.send("Hello Cinemay Server")
})
app.use(notFound)
export default app;
