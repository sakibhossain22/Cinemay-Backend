import { AppError } from "../../src/error/AppError";
import { prisma } from "../../src/lib/prisma";
import { ICreateComment } from "./commet.interface";

const createComment = async (data: ICreateComment) => {
    try {
        const newComment = await prisma.comment.create({
            data: {
                content: data.content,
                userId: data.userId,
                reviewId: data.reviewId,
                parentId: data.parentId || null, // যদি রিপ্লাই হয় তবে parentId থাকবে
            },
            include: {
                user: {
                    select: { name: true, image: true } // ইউজারের নাম ও ছবিসহ রিটার্ন করবে
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
            parentId: null // শুধু মেইন কমেন্টগুলো আগে আনবে
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