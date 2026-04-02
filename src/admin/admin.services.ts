import { PaymentStatus, PurchaseType, Role, UserStatus } from "../../generated/prisma/enums";
import { AppError } from "../error/AppError";
import { prisma } from "../lib/prisma";
import { AdminMediaInput } from "./admin.interface";

const bulkAddMedia = async (payload: any[]) => {
    // map ব্যবহার করে প্রতিটি মুভির জন্য একটি করে create অপারেশন তৈরি করা হচ্ছে
    const operations = payload.map((item) => {
        return prisma.movie.create({
            data: {
                tmdb_id: item.tmdb_id,
                title: item.title,
                customid: item.customid,
                type: item.type, // 'MOVIE' or 'SERIES'
                synopsis: item.synopsis,
                posterUrl: item.posterUrl,
                genre: item.genre,
                releaseYear: item.releaseYear,
                director: item.director,
                cast: item.cast,
                streamingLink: item.streamingLink,
                downloadLink: item.downloadLink,
                episodeLinks: item.episodeLinks,
                contentType: item.contentType,
                ratingAverage: item.ratingAverage,
                buyPrice: item.buyPrice,
                rentPrice: item.rentPrice,
                rentDuration: item.rentDuration,
                // ক্যাটাগরি কানেক্ট করার লজিক
                categories: {
                    connect: item.categories?.map((catName: string) => ({ name: catName })) || []
                }
            }
        });
    });

    // সকল অপারেশন একবারে ট্রানজ্যাকশনের মাধ্যমে ডাটাবেসে পাঠানো হচ্ছে
    const results = await prisma.$transaction(operations);
    return results;
};

export const getTheMovie = async (id: string, type: 'MOVIE' | 'SERIES') => {
    const TMDB_API_KEY = "ce2a7837d2f4c072f0976a85f1d3a08a";
    if (!id) {
        throw new AppError("TMDB ID is required", 400);
    }

    const endpoint = type === 'SERIES' ? 'tv' : 'movie';
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
        );

        if (!response.ok) {
            throw new AppError(`${type} not found on TMDB`, 404);
        }

        const data = await response.json();

        const title = type === 'SERIES' ? data.name : data.title;
        const releaseDate = type === 'SERIES' ? data.first_air_date : data.release_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : "";

        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const customid = year ? `${slug}-${year}` : slug;

        const formattedData = {
            tmdb_id: data.id.toString(),
            title: title,
            customid: customid,
            type: type, // MOVIE অথবা SERIES
            synopsis: data.overview,
            posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w600_and_h900_face${data.poster_path}` : null,
            releaseYear: year,
            genre: data.genres?.map((g: any) => g.name).slice(0, 3) || [],
            // Series এর ক্ষেত্রে সাধারণত 'Created By' থাকে, Movie এর ক্ষেত্রে 'Director'
            director: type === 'SERIES'
                ? (data.created_by?.[0]?.name || "N/A")
                : (data.credits?.crew?.find((c: any) => c.job === "Director")?.name || "Unknown"),
            cast: data.credits?.cast?.slice(0, 8).map((c: any) => c.name) || [],
            ratingAverage: data.vote_average ? Number(data.vote_average.toFixed(1)) : 0,
        };

        return formattedData;

    } catch (error: any) {
        console.error("TMDB Fetch Error:", error.message);
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to fetch details from TMDB", 500);
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
    if (!data.name) {
        throw new AppError("Category name is required", 400);
    }
    if (data.name.length > 50) {
        throw new AppError("Category name must be less than 50 characters", 400);
    }
    const existingCategory = await prisma.category.findUnique({
        where: { name: data.name.toLocaleUpperCase() }
    });
    if (existingCategory) {
        throw new AppError("Category already exists", 400);
    }

    return await prisma.category.create({
        data: {
            name: data.name.toLocaleUpperCase(),
            description: data.description
        }
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
                movie: { select: { title: true, customid : true } }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.review.aggregate({ _avg: { rating: true } }),
        prisma.review.count()
    ]);

    return { reviews, totalReviews, averageRating: stats._avg.rating || 0 };
};

const updateReviewStatus = async (reviewId: string) => {
    return await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved: true }
    });
};
const updateCategory = async (categoryId: string, name: string) => {
    const isDuplicate = await prisma.category.findFirst({
        where: {
            name,
            id: { not: categoryId }

        }
    });
    if (isDuplicate) {
        throw new AppError("Category name already exists", 400);
    }

    return await prisma.category.update({
        where: { id: categoryId },
        data: { name }
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
        return await prisma.category.findMany();
    } catch (error) {
        throw new AppError("Error fetching categories");
    }
};
const deleteCategory = async (categoryId: string) => {
    try {
        return await prisma.category.delete({
            where: { id: categoryId },
            include: {
                movies: true
            }
        });
    } catch (error) {
        throw new AppError("Error deleting category");
    }
};
const getAdminDashboardStats = async () => {
    try {
        const now = new Date();

        // টাইম ক্যালকুলেশন (Growth ও চার্টের জন্য)
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // ১. প্রিজমা ট্রানজ্যাকশন - একবারে সব ডাটা ফেচ করার জন্য
        const [
            totalUsers,
            totalMovies,
            totalReviews,
            totalComments,
            totalPurchases,
            totalWatchlistItems,
            currentMonthRevenueData,
            lastMonthRevenueData,
            contentDistribution,
            topRevenueMovies,
            activeRentalsCount,
            deviceStats,
            recentPayments
        ] = await prisma.$transaction([
            // বেসিক কাউন্টস
            prisma.user.count(),
            prisma.movie.count(),
            prisma.review.count(),
            prisma.comment.count(),
            prisma.purchase.count(),
            prisma.watchlist.count(),

            // বর্তমান মাসের রেভিনিউ
            prisma.payment.aggregate({
                where: { status: 'SUCCESS', createdAt: { gte: firstDayOfMonth } },
                _sum: { amount: true }
            }),

            // গত মাসের রেভিনিউ
            prisma.payment.aggregate({
                where: {
                    status: 'SUCCESS',
                    createdAt: { gte: firstDayOfLastMonth, lt: firstDayOfMonth }
                },
                _sum: { amount: true }
            }),

            // কন্টেন্ট ডিস্ট্রিবিউশন (Fix: _all এর বদলে নির্দিষ্ট ফিল্ড কাউন্ট)
            prisma.movie.groupBy({
                by: ['type'],
                _count: {
                    type: true,
                },
                orderBy: { type: 'asc' }
            }),

            // Top 5 Most Profitable Movies (Fix: _all এর বদলে movieId কাউন্ট)
            prisma.purchase.groupBy({
                by: ['movieId'],
                _sum: { amount: true },
                _count: {
                    movieId: true,
                },
                orderBy: { _sum: { amount: 'desc' } },
                take: 5,
            }),

            // একটিভ রেন্টাল কাউন্ট
            prisma.purchase.count({
                where: {
                    type: 'RENT',
                    expiresAt: { gte: now }
                }
            }),

            // ডিভাইস স্ট্যাটস (userAgent এর ওপর ভিত্তি করে)
            prisma.session.groupBy({
                by: ['userAgent'],
                _count: {
                    userAgent: true,
                },
                take: 5,
                orderBy: { _count: { userAgent: 'desc' } }
            }),

            // রিসেন্ট ৫টি পেমেন্ট অ্যাক্টিভিটি
            prisma.payment.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true, image: true } } }
            })
        ]);

        // ২. টপ মুভিগুলোর ডিটেইলস ফরম্যাট করা (as any দিয়ে টাইপ ফিক্স করা হয়েছে)
        const topMoviesFormatted = await Promise.all(
            topRevenueMovies.map(async (item: any) => {
                const movie = await prisma.movie.findUnique({
                    where: { id: item.movieId },
                    select: { title: true, posterUrl: true }
                });
                return {
                    id: item.movieId,
                    title: movie?.title || "Deleted Content",
                    poster: movie?.posterUrl,
                    totalRevenue: item._sum?.amount ?? 0,
                    totalSales: item._count?.movieId ?? 0
                };
            })
        );

        // ৩. রেভিনিউ গ্রোথ ক্যালকুলেশন
        const currentRev = currentMonthRevenueData._sum?.amount ?? 0;
        const lastRev = lastMonthRevenueData._sum?.amount ?? 0;
        let growthRate = "0.00";

        if (lastRev > 0) {
            growthRate = (((currentRev - lastRev) / lastRev) * 100).toFixed(2);
        } else if (currentRev > 0) {
            growthRate = "100.00";
        }

        // ৪. গত ৭ দিনের সেলস ডাটা (Charts এর জন্য)
        const salesDataRaw = await prisma.purchase.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true, amount: true },
            orderBy: { createdAt: 'asc' }
        });

        // ৫. প্রিমিয়াম ইউজার কাউন্ট
        const premiumUsers = await prisma.user.count({ where: { isPremium: true } });

        return {
            success: true,
            data: {
                summary: {
                    totalUsers,
                    totalMovies,
                    totalPurchases,
                    totalComments,
                    activeRentals: activeRentalsCount,
                    totalRevenue: currentRev,
                    revenueGrowth: `${growthRate}%`,
                    premiumUsers
                },
                contentInsights: {
                    distribution: contentDistribution.map((item: any) => ({
                        type: item.type,
                        count: item._count?.type ?? 0
                    })),
                    topPerforming: topMoviesFormatted
                },
                engagement: {
                    totalWatchlistItems,
                    totalReviews
                },
                recentActivities: {
                    payments: recentPayments
                },
                technical: {
                    deviceUsage: deviceStats.map((item: any) => ({
                        browser: item.userAgent,
                        count: item._count?.userAgent ?? 0
                    }))
                },
                charts: {
                    salesOverTime: salesDataRaw
                }
            }
        };
    } catch (error: any) {
        console.error("ADMIN_STATS_SERVICE_ERROR:", error);
        throw new Error(error.message || "Failed to generate admin report");
    }
};
export const adminServices = {
    addCategory,
    deleteCategory,
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
    getAllWatchlists,
    updateCategory,
    getAdminDashboardStats,
    bulkAddMedia
};