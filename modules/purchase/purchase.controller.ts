import { Request, Response } from "express";
import { purchaseService } from "./purchase.services";
import { prisma } from "../../src/lib/prisma";
import { stripeService } from "../../src/lib/stripe.service";

const purchaseMovie = async (req: Request, res: Response) => {
    try {
        const { movieId, type } = req.body;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json(
            {
                success: false,
                message: "Unauthorized"

            }
        );

        const result = await purchaseService.createPurchase(userId, movieId, type);

        res.status(201).json({
            success: true,
            ok: true,
            message: `Movie ${type === "BUY" ? "purchased" : "rented"} successfully`,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed Purchase Media"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};

const getMyMovies = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const purchases = await purchaseService.getUserPurchases(userId!);
        res.status(200).json(
            {
                success: true,
                ok: true,
                message: "User Purchases Movies retrieved successfully",
                data: purchases
            }
        );
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Get Movies"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};
const startPurchase = async (req: Request, res: Response) => {
    try {
        const { movieId, type } = req.body;
        const userId = req.user?.id;

        const movie = await prisma.movie.findUnique(
            {
                where: {
                    id: movieId
                }
            }
        );
        if (movie?.contentType === "FREE") return res.status(400).json({ message: "This movie is free, no need to purchase" });

        if (!movie) return res.status(404).json({ message: "Movie not found" });

        const price = type === "BUY" ? movie.buyPrice : movie.rentPrice;
        if (!price || price <= 0) return res.status(400).json({ message: "Invalid price" });

        // 1. Create Stripe Payment Intent
        const paymentIntent = await stripeService.createPaymentIntent(price);

        const newPayment = await prisma.payment.create({
            data: {
                userId: userId!,
                amount: price,
                currency: "USD",
                transactionId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret!,
                method: "STRIPE",
            }
        });
        res.status(200).json({
            success: true,
            ok: true,
            message: "Payment Intent created successfully",
            ...newPayment
        });
    } catch (error: any) {
        res.status(500).json(
            {
                success: false,
                message: error.message
            }
        );
    }
};

const confirmPurchase = async (req: Request, res: Response) => {
    try {
        const { movieId, type, paymentIntentId } = req.body;
        const userId = req.user?.id;

        // In production: Verify paymentIntentId with Stripe before creating record
        const purchase = await purchaseService.createPurchase(userId!, movieId, type, paymentIntentId);

        res.status(201).json({
            success: true,
            ok: true,
            message: "Payment confirmed and access granted",
            data: purchase
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const purchaseController = {
    purchaseMovie,
    getMyMovies,
    startPurchase,
    confirmPurchase
};