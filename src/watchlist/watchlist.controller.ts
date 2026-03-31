import { Request, Response } from "express";
import { watchlistService } from "./watchlist.services";

const addToWatchlist = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const { movieId } = req.body;
        const watchlistItem = await watchlistService.addToWatchlist({ userId: user.id as string, movieId });

        res.status(200).json({
            success: true,
            message: "Media added to watchlist successfully",
            ok: true,
            data: watchlistItem

        })

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Add to Watchlist"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const getWatchlistByUserId = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const watchlistItems = await watchlistService.getWatchlistByUserId(user.id as string);

        res.status(200).json({
            success: true,
            message: "Watchlist retrieved successfully",
            ok: true,
            data: watchlistItems
        })

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Retrieve Watchlist"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}

const removeFromWatchlist = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const movieId = req.params.id;
        const response = await watchlistService.removeFromWatchlist(user.id as string, movieId as string);

        res.status(200).json({
            success: true,
            message: "Media removed from watchlist successfully",
            ok: true,
            data: response
        })

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Remove from Watchlist"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}


export const watchlistController = {
    addToWatchlist,
    getWatchlistByUserId,
    removeFromWatchlist
}