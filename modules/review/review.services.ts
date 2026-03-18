import { tr } from "zod/locales"
import { AppError } from "../../src/error/AppError"
import { prisma } from "../../src/lib/prisma"
import { IReview } from "./review.interface"


const addReview = async (reviewData: IReview, userId: string) => {
    try {
        const { movieId, rating, content, tags } = reviewData

        const result = await prisma.review.create({
            data: {
                movieId,
                content,
                rating,
                userId,
                tags
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
        const result = await prisma.review.update({
            where: {
                id: reviewId
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
const getAllReviews = async () => {
    try {
        const result = await prisma.review.findMany({
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

export const reviewServices = {
    addReview,
    deleteReview,
    editReview,
    getAllReviews
}   
