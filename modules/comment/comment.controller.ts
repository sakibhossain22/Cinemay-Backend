import { Request, Response } from "express";
import { ICreateComment } from "./commet.interface";
import { commentServices } from "./comment.services";


const postComment = async (req: Request, res: Response) => {
    const { content, reviewId, parentId } = req.body;
    const userId = req.user?.id;

    if (!content || !reviewId) {
        return res.status(400).json({ message: "Content and ReviewId are required" });
    }
    const commmentData = {
        content,
        reviewId,
        userId: userId!,
        parentId
    };

    const result = await commentServices.createComment(commmentData as ICreateComment);

    res.status(201).json(
        {
            success: true,
            message: "Comment posted successfully",
            ok: true,
            data: result
        }
    );
};
const getCommentsByReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;

        if (!reviewId) {
            return res.status(400).json({
                success: false,
                message: "Review ID is required"
            });
        }

        // সার্ভিস থেকে ডাটা নিয়ে আসা
        const comments = await commentServices.getCommentsByReview(reviewId as string);

        return res.status(200).json({
            success: true,
            ok: true,
            message: "Comments fetched successfully",
            count: comments.length,
            data: comments
        });

    } catch (error: any) {
        console.error("Fetch Comments Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch comments"
        });
    }
};
const deleteCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?.id;
        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: "Comment ID is required"
            });
        }

        // সার্ভিস থেকে ডাটা নিয়ে আসা
        const comment = await commentServices.deleteCommentById(commentId as string, userId! as string);

        return res.status(200).json({
            success: true,
            ok: true,
            message: "Comment deleted successfully",
            data: comment
        });

    } catch (error: any) {
        console.error("Delete Comment Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete comment"
        });
    }
};


export const commentController = {
    postComment,
    getCommentsByReview,
    deleteCommentById
}