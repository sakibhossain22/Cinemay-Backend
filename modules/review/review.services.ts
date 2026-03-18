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
const editReview = async (reviewId: string, reviewData: IReview, userId: string) => {
    try {

    } catch (error) {
        throw error
    }
}
const deleteReview = async (reviewId: string) => {
    try {
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

export const reviewServices = {
    addReview,
    deleteReview
}