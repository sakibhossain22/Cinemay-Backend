import { tr } from "zod/locales"
import { AppError } from "../error/AppError"
import { prisma } from "../lib/prisma"
import { IReview } from "./review.interface"
import { UserStatus } from "../../generated/prisma/enums"


const addReview = async (reviewData: IReview, userId: string) => {
    try {
        const { movieId, rating, content, hasSpoiler } = reviewData

        const result = await prisma.review.create({
            data: {
                movieId,
                content,
                rating,
                userId,
                hasSpoiler
            },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        isPremium: true,
                        image: true
                    }
                },
                comments: true,
                likes: true,
            }
        })
        return result
    } catch (error) {
        throw error
    }
}
const editReview = async (reviewId: string, reviewData: Partial<IReview>, userId: string) => {
    try {
        const { rating, content, movieId } = reviewData

        const existingReview = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        if (!existingReview) {
            throw new AppError("Review not found")
        }
        if (existingReview.userId !== userId) {
            throw new AppError("You are not authorized to edit this review", 403)
        }
        if (existingReview.isApproved) {
            throw new AppError("Approved review cannot be edited because it has already been approved.", 400)
        }
        const result = await prisma.review.update({
            where: {
                id: reviewId,
                // isApproved: false
            },
            data: {
                rating,
                content,
                movieId
            }
        })

        return result
    } catch (error) {
        throw error
    }
}
const deleteReview = async (reviewId: string, userId: string) => {
    try {
        const existingReview = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        if (!existingReview) {
            throw new AppError("Review not found")
        }

        if (existingReview.userId !== userId) {
            throw new AppError("You are not authorized to delete this review", 403)
        }

        const result = await prisma.review.delete({
            where: {
                id: reviewId
            }
        })
        return result
    } catch (error) {
        throw error
    }
}
const getAllReviews = async (userId: string) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!findUser) {
            throw new AppError("User not found", 404)
        }

        const result = await prisma.review.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        isPremium: true,
                        image: true
                    }
                },
                comments: true,
                likes: true,
                movie: {
                    select: {
                        title: true,
                        streamingLink: true,
                        genre: true,
                        releaseYear: true,
                        cast: true,
                        type: true,
                    }
                }
            }
        })
        return result
    } catch (error) {
        throw error
    }
}
const addLikeInReview = async (reviewId: string, userId: string) => {
    try {
        console.log(reviewId, userId)
        // ১. চেক করা ইউজার আগে লাইক দিয়েছে কি না
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_reviewId: {
                    userId,
                    reviewId,
                },
            },
        });

        return await prisma.$transaction(async (tx) => {
            if (existingLike) {
                // ২. যদি আগে লাইক থাকে -> ডিলিট করো (Unlike)
                await tx.like.delete({
                    where: {
                        id: existingLike.id,
                    },
                });

                // ৩. রিভিউর মোট লাইক সংখ্যা কমাও
                const updatedReview = await tx.review.update({
                    where: { id: reviewId },
                    data: {
                        likeCount: {
                            decrement: 1,
                        },
                    },
                });

                return {
                    message: "Like removed",
                    liked: false,
                    totalLikes: updatedReview.likeCount
                };
            } else {
                // ৪. যদি লাইক না থাকে -> নতুন লাইক তৈরি করো
                await tx.like.create({
                    data: {
                        reviewId,
                        userId,
                    },
                });

                // ৫. রিভিউর মোট লাইক সংখ্যা বাড়াও
                const updatedReview = await tx.review.update({
                    where: { id: reviewId },
                    data: {
                        likeCount: {
                            increment: 1,
                        },
                    },
                });

                return {
                    message: "Like added",
                    liked: true,
                    totalLikes: updatedReview.likeCount
                };
            }
        });
    } catch (error) {
        console.error("Error in addLikeInReview:", error);
        throw new Error("Failed to toggle like on review");
    }
};

export const reviewServices = {
    addReview,
    deleteReview,
    addLikeInReview,
    editReview,
    getAllReviews,
}   
