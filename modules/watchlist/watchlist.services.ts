import { AppError } from "../../src/error/AppError";
import { prisma } from "../../src/lib/prisma";
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
                        title: true,
                        genre: true,
                        releaseYear: true,
                        cast: true,
                        reviews: {
                            select: {
                                rating: true,
                                tags: true,
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
                        title: true,
                        genre: true,
                        releaseYear: true,
                        cast: true,
                        reviews: {
                            select: {
                                rating: true,
                                tags: true,
                            },
                        },
                        contentType: true,
                    }
                },
            }
        });
    } catch (error) {
        throw new AppError("Failed to fetch watchlist");
    }
}
export const watchlistService = {
    addToWatchlist,
    getWatchlistByUserId,
}