import { Request, Response } from "express";
import { reviewServices } from "./review.services";

const addReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id as string
        const reviewData = req.body

        const result = await reviewServices.addReview(reviewData, userId)
        res.status(200).json({
            success: true,
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Add Review"
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


export const reviewController = {
    addReview,
}