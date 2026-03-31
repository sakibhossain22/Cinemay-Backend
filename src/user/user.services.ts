import { prisma } from "../lib/prisma";

const getUserDashboardData = async (userId: string) => {
    const [profile, purchases, watchlists, reviews, comments] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId }
        }),
        prisma.purchase.findMany({
            where: {
                userId,
                OR: [
                    { type: "BUY" },
                    { type: "RENT", expiresAt: { gt: new Date() } }
                ]
            },
            include: { movie: { select: { id: true, title: true, posterUrl: true, type: true } } },
            orderBy: { createdAt: "desc" }
        }),
        prisma.watchlist.findMany({
            where: { userId },
            include: { movie: { select: { id: true, title: true, posterUrl: true, ratingAverage: true } } }
        }),
        prisma.review.findMany({
            where: { userId },
            include: { movie: { select: { title: true } } },
            orderBy: { createdAt: "desc" }
        }),
        prisma.comment.findMany({
            where: { userId },
            include: { replies: true, review: { include: { movie: { select: { title: true } } } } },
            orderBy: { createdAt: "desc" }
        })
    ]);

    return { profile, purchases, watchlists, reviews, comments };
};

const updateProfile = async (userId: string, data: { name?: string; image?: string, phone?: string }) => {
    return await prisma.user.update({
        where: { id: userId },
        data
    });
};

const getProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { 
            id: userId 
        }
    });
};


export const userService = {
    getUserDashboardData,
    updateProfile,
    getProfile
};