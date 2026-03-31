import { Request, Response } from "express";
import { historyService } from "./history.service";

// ১. হিস্ট্রি সেভ বা আপডেট করা
const trackView = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "User ID is required"
            });
        }
        const result = await historyService.trackView(userId, req.body);
        console.log(result)
        res.status(200).json({
            success: true,
            message: "History Updated Successfully",
            ok: true,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Update History";
        res.status(500).json({
            success: false,
            data: null,
            error: errorMessage
        });
    }
};

// ২. ইউজারের হিস্ট্রি গেট করা
const getHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "User ID is required"
            });
        }
        const result = await historyService.getHistory(userId);
        res.status(200).json({
            success: true,
            message: "History Fetched Successfully",
            ok: true,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Fetch History";
        res.status(500).json({
            success: false,
            data: null,
            error: errorMessage
        });
    }
};

// ৩. সব হিস্ট্রি ডিলিট করা
const clearHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "User ID is required"
            });
        }
        await historyService.clearHistory(userId);
        res.status(200).json({
            success: true,
            message: "All History Cleared Successfully",
            ok: true,
            data: null
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Clear History";
        res.status(500).json({
            success: false,
            data: null,
            error: errorMessage
        });
    }
};

export const historyController = {
    trackView,
    getHistory,
    clearHistory
};