import express, { Request, Response } from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from '../src/lib/auth';
import cors from 'cors';
import { notFound } from '../src/lib/middlewares/notFound';
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



const app = express();
app.use(cookieParser())

app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}));

// Api
app.use("/api/auth", authRoutes);

app.all("/api/auth/*slat", toNodeHandler(auth));
app.use("/api/media", mediaRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/watchlist", watchListRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/user/subscription", userRoutes);



app.get('/', async (req: Request, res: Response) => {
    res.send("Hello Cinemay Server")
})
app.use(notFound)
export default app;
