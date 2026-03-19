import { PaymentStatus, PurchaseType, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../src/lib/prisma";

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        include: {
            sessions: true,
            payments: true,
            reviews: true,
            purchases: true,
            comments: true,
            watchlists: true,
        }
    });
    // count total users
    const totalUsers = await prisma.user.count();
    return { users, totalUsers };
}
const getAllReviews = async () => {
    const reviews = await prisma.review.findMany({
        include: {
            user: true,
            movie: true,
        }
    });
    const averageRating = await prisma.review.aggregate({
        _avg: {
            rating: true,
        },
    });
    const totalReviews = await prisma.review.count();

    return { reviews, totalReviews, averageRating: averageRating._avg.rating };
}
const getAllPayments = async () => {

    // aggregate all payments with user details for admin dashboard
    const pendingPayments = await prisma.payment.findMany({
        include: {
            user: true,
        },
        where: {
            status: PaymentStatus.PENDING,

        }
    });
    const completedPayments = await prisma.payment.findMany({
        include: {
            user: true,
        }, where: {
            status: PaymentStatus.SUCCESS,
        }
    });
    const failedPayments = await prisma.payment.findMany({
        include: {
            user: true,
        }, where: {
            status: PaymentStatus.FAILED,
        }
    });
    const revenueByPurchaseTypeBuy = await prisma.purchase.findMany({
        where: {
            type: PurchaseType.BUY,
        }
    });
    const revenueByPurchaseTypeRent = await prisma.purchase.findMany({
        where: {
            type: PurchaseType.RENT,
        }
    });
    const totalRevenueByBuy = revenueByPurchaseTypeBuy.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalRevenueByRent = revenueByPurchaseTypeRent.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalRevenue = [...completedPayments, ...pendingPayments].reduce((sum, payment) => sum + payment.amount, 0);
    return {
        pendingPayments,
        completedPayments,
        failedPayments,
        totalRevenue,
        revenueByPurchaseTypeBuy,
        revenueByPurchaseTypeRent,
        totalRevenueByBuy,
        totalRevenueByRent,
    };

}
const getAllMedia = async () => {
    const media = await prisma.movie.findMany({
        include: {
            reviews: true,
            watchlists: true,
            purchases: true,
        }
    });
    const totalMedia = await prisma.movie.count();
    const mostReviewedMedia = await prisma.movie.findMany({
        orderBy: {
            reviews: {
                _count: 'desc'
            }
        }
    });
    return { media, totalMedia, mostReviewedMedia };
}
const getAllComments = async () => {
    const comments = await prisma.comment.findMany({
        include: {
            user: true,
            replies: {
                include: {
                    user: true,
                    replies: {
                        include: {
                            user: true,
                        }
                    }
                }
            }
        }
    });
    const totalComments = await prisma.comment.count();
    return { comments, totalComments };
}
const getAllWatchlists = async () => {
    const watchlists = await prisma.watchlist.findMany({
        include: {
            user: true,
            movie: true,
        }
    });
    const totalWatchlists = await prisma.watchlist.count();
    return { watchlists, totalWatchlists };
}
const editMedia = async (mediaId: string, updateData: any) => {
    const updatedMedia = await prisma.movie.update({
        where: { id: mediaId },
        data: updateData
    });
    return updatedMedia;
}
const deleteMedia = async (mediaId: string) => {
    await prisma.movie.delete({
        where: { id: mediaId },
    });
}
const updateReviewStatus = async (reviewId: string, status: string) => {
    const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
            isApproved: status === "approved" ? true : false,
        },
    });
    return updatedReview;
}
const deleteReview = async (reviewId: string) => {
    await prisma.review.delete({
        where: { id: reviewId },
    });
}
const deleteUser = async (userId: string) => {
    await prisma.user.delete({
        where: { id: userId },
    });
}
const banUser = async (userId: string) => {
    const bannedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            status: UserStatus.BANNED,
        },
    });
    return bannedUser;
}
const deleteComment = async (commentId: string) => {
    await prisma.comment.delete({
        where: { id: commentId },
    });
}
const addCategory = async (data: { name: string, description: string }) => {
    const result = await prisma.category.create({
        data: {
            name: data.name,
            description: data.description
        }
    })
    return result
}

export const adminServices = {
    addCategory,
    getAllUsers,
    getAllReviews,
    getAllPayments,
    getAllMedia,
    getAllComments,
    getAllWatchlists,
    editMedia,
    deleteMedia,
    updateReviewStatus,
    deleteReview,
    deleteUser,
    banUser,
    deleteComment,
}