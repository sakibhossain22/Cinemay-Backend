import { AppError } from "../error/AppError";
import { prisma } from "../lib/prisma";
import { WatchlistItem } from "./watchlist.interface";

const addToWatchlist = async (data: WatchlistItem) => {
    try {
        const { userId, movieId } = data;
        const existingItem = await prisma.watchlist.findFirst({
            where: {
                userId,
                movieId,
            },
        });
        if (existingItem) {
            throw new AppError("Media already in watchlist");
        }
        return await prisma.watchlist.create({
            data: {
                userId,
                movieId,
            },
            include: {
                user: {

                },
                movie: {
                    select: {
                        id: true,
                        title: true,
                        genre: true,
                        releaseYear: true,
                        cast: true,
                        reviews: {
                            select: {
                                rating: true
                            },
                        },
                        contentType: true,
                        watchlists: {
                            select: {
                                userId: true,
                            }
                        }
                    }
                },
            }
        });

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Failed to Add to Watchlist");
    }
}
const getWatchlistByUserId = async (userId: string) => {
    try {
        return await prisma.watchlist.findMany({
            where: {
                userId,
            },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        customid: true,
                        genre: true,
                        releaseYear: true,
                        cast: true,
                        ratingAverage: true,
                        contentType: true,
                        posterUrl: true
                    }
                },
            }
        });
    } catch (error) {
        throw new AppError("Failed to fetch watchlist");
    }
}
const removeFromWatchlist = async (userId: string, movieId: string) => {
    try {
        console.log(movieId, userId)
        const existingItem = await prisma.watchlist.findFirst({
            where: {
                userId,
                movieId,
            },
        });
        console.log(existingItem)
        if (!existingItem) {
            throw new AppError("Media not found in watchlist");
        }
        await prisma.watchlist.delete({
            where: {
                id: existingItem.id,
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Failed to Remove from Watchlist");
    }
}

export const watchlistService = {
    addToWatchlist,
    getWatchlistByUserId,
    removeFromWatchlist
}