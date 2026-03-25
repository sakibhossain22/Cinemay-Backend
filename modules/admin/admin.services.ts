import { PaymentStatus, PurchaseType, Role, UserStatus } from "../../generated/prisma/enums";
import { AppError } from "../../src/error/AppError";
import { prisma } from "../../src/lib/prisma";
import { AdminMediaInput } from "./admin.interface";


export const getTheMovie = async (id: string) => {
    const TMDB_API_KEY = "ce2a7837d2f4c072f0976a85f1d3a08a";

    if (!id) {
        throw new AppError("TMDB Movie ID is required", 400);
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
        );

        if (!response.ok) {
            throw new AppError("Movie not found on TMDB", 404);
        }

        const data = await response.json();
        console.log(data)
        const year = data.release_date ? new Date(data.release_date).getFullYear() : "";

        const slug = data.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const customid = year ? `${slug}-${year}` : slug;

        const formattedData = {
            tmdb_id: data.id.toString(),
            title: data.title,
            customid: customid,
            synopsis: data.overview,
            posterUrl: `https://image.tmdb.org/t/p/w600_and_h900_face${data.poster_path}`,
            releaseYear: year,
            genre: data.genres?.map((g: any) => g.name).slice(0, 3) || [],
            director: data.credits?.crew?.find((c: any) => c.job === "Director")?.name || "Unknown",
            cast: data.credits?.cast?.slice(0, 8).map((c: any) => c.name) || [],
            ratingAverage: Number(data.vote_average.toFixed(1)),
        };

        return formattedData;

    } catch (error: any) {
        console.error("TMDB Fetch Error:", error.message);
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to fetch movie details from TMDB", 500);
    }
}
const getAllUsers = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [users, totalUsers, countUsers, countAdmin] = await Promise.all([
        prisma.user.findMany({
            where: { role: Role.USER },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                image: true,
                isPremium: true,
                _count: {
                    select: { reviews: true, payments: true, comments: true }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count(),
        prisma.user.count({ where: { role: Role.USER } }),
        prisma.user.count({ where: { role: Role.ADMIN } })
    ]);

    return { users, totalUsers, countUsers, countAdmin, page, totalPages: Math.ceil(countUsers / limit) };
};

const banUser = async (userId: string, status: UserStatus) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    if (user.role === Role.ADMIN) throw new AppError("Admin cannot be banned", 403);

    return await prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.BANNED }
    });
};


const deleteUser = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    if (user.role === Role.ADMIN) throw new AppError("Admin cannot be deleted", 403);

    return await prisma.user.delete({ where: { id: userId } });
};


const getAllMedia = async () => {
    const [media, totalMedia, mostReviewedMedia] = await Promise.all([
        prisma.movie.findMany({
            include: {
                categories: true,
                _count: { select: { reviews: true, purchases: true } }
            }
        }),
        prisma.movie.count(),
        prisma.movie.findMany({
            orderBy: { reviews: { _count: 'desc' } },
            take: 5
        })
    ]);
    return { media, totalMedia, mostReviewedMedia };
};

const editMedia = async (mediaId: string, updateData: AdminMediaInput) => {
    const { category, ...movieData } = updateData;

    return await prisma.movie.update({
        where: { id: mediaId },
        data: {
            ...movieData,
            categories: category ? {
                set: [],
                connectOrCreate: category.map(name => ({
                    where: { name },
                    create: { name }
                }))
            } : undefined
        }
    });
};

const deleteMedia = async (mediaId: string) => {
    return await prisma.movie.delete({ where: { id: mediaId } });
};

const addCategory = async (data: { name: string, description: string }) => {
    return await prisma.category.upsert({
        where: { name: data.name },
        update: { description: data.description },
        create: { name: data.name, description: data.description }
    });
};


const getAllPayments = async () => {
    const [payments, revenueData, purchaseData] = await Promise.all([
        prisma.payment.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.payment.aggregate({
            where: { status: PaymentStatus.SUCCESS },
            _sum: { amount: true }
        }),
        prisma.purchase.groupBy({
            by: ['type'],
            _sum: { amount: true },
            _count: { id: true }
        })
    ]);

    const stats = {
        totalRevenue: revenueData._sum.amount || 0,
        buyRevenue: purchaseData.find(p => p.type === PurchaseType.BUY)?._sum.amount || 0,
        rentRevenue: purchaseData.find(p => p.type === PurchaseType.RENT)?._sum.amount || 0,
    };

    return { payments, stats };
};


const getAllReviews = async () => {
    const [reviews, stats, totalReviews] = await Promise.all([
        prisma.review.findMany({
            include: {
                user: { select: { name: true, image: true } },
                movie: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.review.aggregate({ _avg: { rating: true } }),
        prisma.review.count()
    ]);

    return { reviews, totalReviews, averageRating: stats._avg.rating || 0 };
};

const updateReviewStatus = async (reviewId: string, status: "approved" | "rejected") => {
    return await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved: status === "approved" }
    });
};

const deleteReview = async (reviewId: string) => {
    return await prisma.review.delete({
        where: { id: reviewId }
    });
};

const getAllComments = async () => {
    const [comments, totalComments] = await Promise.all([
        prisma.comment.findMany({
            where: { parentId: null }, // শুধু মেইন কমেন্টগুলো আনবে (Top-level)
            include: {
                user: { select: { name: true, image: true } },
                review: { include: { movie: { select: { title: true } } } },
                replies: {
                    include: {
                        user: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.comment.count()
    ]);
    return { comments, totalComments };
};

const deleteComment = async (commentId: string) => {
    return await prisma.comment.delete({ where: { id: commentId } });
};

const getAllWatchlists = async () => {
    const [watchlists, totalWatchlists] = await Promise.all([
        prisma.watchlist.findMany({
            include: {
                user: { select: { name: true, email: true } },
                movie: { select: { title: true, posterUrl: true } }
            }
        }),
        prisma.watchlist.count()
    ]);
    return { watchlists, totalWatchlists };
};
const getAllCategories = async () => {
    try {
        return await prisma.category.findMany({
            where: {
                movies: { some: {} }
            }
        });
    } catch (error) {
        throw new AppError("Error fetching categories");
    }
};

export const adminServices = {
    addCategory,
    getAllCategories,
    getTheMovie,
    getAllUsers,
    getAllReviews,
    getAllPayments,
    getAllMedia,
    editMedia,
    deleteMedia,
    updateReviewStatus,
    deleteReview,
    deleteUser,
    banUser,
    getAllComments,
    deleteComment,
    getAllWatchlists
};