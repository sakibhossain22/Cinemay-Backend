import { ContentType, PaymentStatus, PurchaseType } from "../../generated/prisma/enums";
import { AppError } from "../error/AppError";
import { prisma } from "../lib/prisma";


const createPurchase = async (userId: string, movieId: string, type: PurchaseType, paymentIntentId?: string) => {
    const checkTransaction = await prisma.payment.findUnique({
        where: { transactionId: paymentIntentId! }
    });
    if (!checkTransaction) throw new AppError("Payment transaction not found", 404);
    const alreadyPurchased = await prisma.purchase.findFirst({
        where: {
            userId,
            movieId,
            OR: [
                { type: "BUY" },
                {
                    type: "RENT",
                    expiresAt: { gt: new Date() }
                }
            ]
        }
    });
    if (alreadyPurchased) throw new AppError("You have already purchased or rented this movie", 400);

    const movie = await prisma.movie.findUnique({
        where: { id: movieId }
    });

    if (!movie) throw new AppError("Movie not found", 404);
    if (movie.contentType === "FREE") throw new AppError("This movie is free, no need to purchase", 400);

    const amount = type === "BUY" ? movie.buyPrice : movie.rentPrice;

    let expiresAt: Date | null = null;

    if (type === "RENT") {
        const duration = movie.rentDuration || 48; // Fallback to 48 if rentDuration is null
        expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + Number(duration));
    }

    const createPaymentInDB = await prisma.purchase.create({
        data: {
            userId,
            movieId,
            type,
            amount: amount || 0,
            expiresAt: expiresAt // explicit mapping

        },
        include: {
            movie: true,
            user: {
                select: { name: true, email: true, image: true }
            }
        }
    });
    const updatedPayment = await prisma.payment.update({
        where: { transactionId: paymentIntentId! },
        data: {
            status: PaymentStatus.SUCCESS
        }
    })
    return { createPaymentInDB, updatedPayment };

};

const getUserPurchases = async (userId: string) => {
    const now = new Date(); // বর্তমান সময়

    const movies = await prisma.purchase.findMany({
        where: {
            userId,
            OR: [
                {
                    type: { not: "RENT" }
                },
                {
                    type: "RENT",
                    expiresAt: {
                        gt: now
                    }
                }
            ]
        },
        include: {
            movie: true
        },
        orderBy: { createdAt: "desc" }
    });

    const userSubscriptions = await prisma.payment.findMany({
        where: {
            userId,
            method: "STRIPE_USER_SUBSCRIPTION",
            status: PaymentStatus.SUCCESS
        },
        orderBy: { createdAt: "desc" }
    });

    return { movies, userSubscriptions };
};

const checkAccess = async (userId: string, movieId: string) => {
    const purchase = await prisma.purchase.findFirst({
        where: {
            userId,
            movieId,
            OR: [
                { type: "BUY" },
                {
                    type: "RENT",
                    expiresAt: { gt: new Date() }
                }
            ]
        }
    });
    return !!purchase;
};

export const purchaseService = {
    createPurchase,
    getUserPurchases,
    checkAccess
};