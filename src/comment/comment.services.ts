import { AppError } from "../error/AppError";
import { prisma } from "../lib/prisma";
import { ICreateComment } from "./commet.interface";

const createComment = async (data: ICreateComment) => {
    try {
        const newComment = await prisma.comment.create({
            data: {
                content: data.content,
                userId: data.userId,
                reviewId: data.reviewId,
                parentId: data.parentId || null,
            },
            include: {
                user: {
                    select: { name: true, image: true } 
                }
            }
        });
        return newComment;
    } catch (error) {
        throw new Error("Failed to post comment");
    }
};

const getCommentsByReview = async (reviewId: string) => {
    return await prisma.comment.findMany({
        where: {
            reviewId,
            parentId: null
        },
        include: {
            user: { select: { name: true, image: true } },
            replies: {
                include: {
                    user: { select: { name: true, image: true } }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
};
const deleteCommentById = async (commentId: string, userId: string) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId }
    });
    if (!comment) {
        throw new AppError("Comment not found", 404);
    }
    if (comment.userId !== userId) {
        throw new AppError("Unauthorized to delete this comment", 403);
    }

    return await prisma.comment.delete({
        where: {
            id: commentId,
            userId: userId
        }
    });
};


export const commentServices = {
    createComment,
    getCommentsByReview,
    deleteCommentById
}