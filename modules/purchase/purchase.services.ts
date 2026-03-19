import { ContentType, PurchaseType } from "../../generated/prisma/enums";
import { AppError } from "../../src/error/AppError";
import { prisma } from "../../src/lib/prisma";


const createPurchase = async (userId: string, movieId: string, type: PurchaseType, paymentIntentId?: string) => {
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
            movie: {
                select: { title: true, posterUrl: true }
            },
            user: {
                select: { name: true, email: true, image: true }
            }
        }
    });
    return createPaymentInDB;

};

const getUserPurchases = async (userId: string) => {
    return await prisma.purchase.findMany({
        where: { userId },
        include: { movie: true },
        orderBy: { createdAt: "desc" }
    });
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