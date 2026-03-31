import { prisma } from "../lib/prisma";

const trackView = async (userId: string, data: { mediaId: string }) => {
    return await prisma.viewHistory.upsert({
        where: {
            userId_mediaId: {
                userId: userId,
                mediaId: data.mediaId
            }
        },
        update: {
            viewedAt: new Date()
        },
        create: {
            userId: userId,
            mediaId: data.mediaId
        }
    });
};

const getHistory = async (userId: string) => {
    return await prisma.viewHistory.findMany({
        where: { userId },
        include: {
            media: true
        },
        orderBy: {
            viewedAt: "desc"
        }
    });
};

const clearHistory = async (userId: string) => {
    return await prisma.viewHistory.deleteMany({
        where: { userId }
    });
};

export const historyService = {
    trackView,
    getHistory,
    clearHistory
};