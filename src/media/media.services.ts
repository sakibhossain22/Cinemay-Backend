import { IMovie, IQuery } from "./media.interface";
import { prisma } from "../lib/prisma";
import { ContentType, MediaType } from "../../generated/prisma/enums";

// ১. মিডিয়া অ্যাড করা (Category সহ)
const addMedia = async (movie: IMovie) => {
    try {
        // ১. category এবং অন্যান্য ফিল্ডগুলো আলাদা করুন
        // নিশ্চিত করুন আপনার IMovie ইন্টারফেসে category নামে স্ট্রিং অ্যারে আছে
        const { category, customId, tmdb_id, ...movieData } = movie;

        // Custom ID (Slug) Generation
        let generatedCustomId = customId || movie.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .concat(`-${movie.releaseYear}`);

        const isCustomIdExist = await prisma.movie.findUnique({
            where: { customid: generatedCustomId }
        });

        if (isCustomIdExist) {
            generatedCustomId = `${generatedCustomId}-${Math.floor(100 + Math.random() * 900)}`;
        }

        // ২. ক্যাটাগরিগুলোকে ম্যাপ করুন (Empty array safety সহ)
        const categoryConnection = Array.isArray(category)
            ? category.map((catName: string) => ({
                where: { name: catName.toUpperCase().trim() },
                create: { name: catName.toUpperCase().trim() },
            }))
            : [];

        const res = await prisma.movie.create({
            data: {
                ...movieData,
                type: movie.type as MediaType,
                contentType: movie.contentType as ContentType,
                tmdb_id: tmdb_id || (movie as any).tmdb_id,
                customid: generatedCustomId,
                categories: {
                    connectOrCreate: categoryConnection,
                },
            },
            include: {
                categories: true
            }
        });

        return res;
    } catch (error: any) {
        console.error("Add Media Error:", error);
        throw new Error(error.message || "Failed to Add Media");
    }
};

// ২. সব মিডিয়া গেট করা (Filter & Category সহ)
const getAllMedia = async (query: IQuery) => {
    try {
        const {
            category,
            genre,
            releaseYear,
            rating,
            searchTerm,
            type,
            page = 1,
            limit = 10,
            sortBy,
            isPremium
        } = query;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const andConditions: any[] = [];

        // ১. বেসিক ফিল্টার
        if (type) andConditions.push({ type: type as any });
        if (genre) andConditions.push({ genre: { has: genre } });
        if (releaseYear) andConditions.push({ releaseYear: parseInt(releaseYear as string) });
        if (rating) andConditions.push({ ratingAverage: { gte: parseFloat(rating as string) } });

        // ২. Is Premium Filter (নতুন যোগ করা হয়েছে)
        // ধরুন আপনার ডাটাবেসে contentType ফিল্ডে 'PREMIUM' বা 'FREE' থাকে
        // query object থেকে isPremium স্ট্রিং বা বুলিয়ান যাই আসুক
        if (isPremium !== undefined) {
            // স্ট্রিং বা বুলিয়ান উভয়কেই চেক করার একটি সেফ উপায়
            const isPremiumValue = String(isPremium).toLowerCase() === 'true';

            if (isPremiumValue) {
                andConditions.push({ contentType: ContentType.PREMIUM });
            } else {
                // যদি explicitly false পাঠানো হয়, তবে শুধু FREE দেখাবে
                andConditions.push({ contentType: ContentType.FREE });
            }
        }

        // ৩. ক্যাটাগরি ফিল্টার
        if (category) {
            andConditions.push({
                categories: {
                    some: {
                        name: {
                            equals: category.toString().toUpperCase().trim()
                        }
                    }
                }
            });
        }

        // ৪. সার্চ টার্ম
        if (searchTerm) {
            andConditions.push({
                OR: [
                    { title: { contains: searchTerm as string, mode: "insensitive" } },
                    { director: { contains: searchTerm as string, mode: "insensitive" } },
                    { cast: { has: searchTerm as string } }
                ],
            });
        }

        const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

        // ৫. Dynamic Sorting Logic (Price High/Low)
        let orderBy: any = { createdAt: "desc" }; // ডিফল্ট সর্টিং

        if (sortBy === 'priceLow') {
            orderBy = { buyPrice: 'asc' };
        } else if (sortBy === 'priceHigh') {
            orderBy = { buyPrice: 'desc' };
        } else if (sortBy === 'newest') {
            orderBy = { createdAt: 'desc' };
        } else if (sortBy === 'rating') {
            orderBy = { ratingAverage: 'desc' };
        }

        // ডাটা ফেচিং
        const [data, total] = await prisma.$transaction([
            prisma.movie.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: orderBy, // এখানে ডাইনামিক সর্টিং কাজ করবে
                include: { categories: true, reviews: true }
            }),
            prisma.movie.count({ where: whereCondition })
        ]);

        return {
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPage: Math.ceil(total / take)
            },
            data
        };
    } catch (error) {
        console.error("PRISMA FILTER ERROR:", error);
        throw new Error("Failed to Get Filtered Media");
    }
}
// ৩. মুভি লিস্ট (ক্যাটাগরি অপশনাল)
const getMovie = async (categoryName?: string) => {
    try {
        return await prisma.movie.findMany({
            where: {
                type: MediaType.MOVIE,
                ...(categoryName && {
                    categories: { some: { name: { contains: categoryName, mode: "insensitive" } } }
                })
            },
            include: { categories: true },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        throw new Error("Failed to Get Movies");
    }
};

// ৪. সিরিজ লিস্ট (ক্যাটাগরি অপশনাল)
const getSeries = async (categoryName?: string) => {
    try {
        return await prisma.movie.findMany({
            where: {
                type: MediaType.SERIES, // আপনার এনুম অনুযায়ী TV_SHOW বা SERIES চেক করুন
                ...(categoryName && {
                    categories: { some: { name: { contains: categoryName, mode: "insensitive" } } }
                })
            },
            include: { categories: true },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        throw new Error("Failed to Get Series");
    }
};

// ৫. অ্যানিমেশন লিস্ট
const getAnimation = async (categoryName?: string) => {
    try {
        return await prisma.movie.findMany({
            where: {
                type: MediaType.ANIMATION,
                ...(categoryName && {
                    categories: { some: { name: { contains: categoryName, mode: "insensitive" } } }
                })
            },
            include: { categories: true }
        });
    } catch (error) {
        throw new Error("Failed to Get Animation");
    }
};

// ৬. আইডি দিয়ে ডিটেইলস (ক্যাটাগরি সহ)
const getMediaById = async (customid: string) => {
    try {
        return await prisma.movie.findUnique({
            where: { customid },
            include: {
                reviews: {
                    where: { isApproved: true },
                    include:
                    {
                        user: {
                            select: {
                                email: true,
                                name: true,
                                isPremium: true,
                                image: true,
                                phone: true
                            }
                        },
                        comments: {
                            include: {
                                user: {
                                    select: {
                                        email: true,
                                        name: true,
                                        isPremium: true,
                                        image: true,
                                        phone: true
                                    }
                                }
                            }
                        },
                        _count: {
                            select: { comments: true, likes: true }
                        }
                    }
                },
                categories: true
            }
        });
    } catch (error) {
        throw new Error("Failed to Get Media by id");
    }
};

export const mediaService = {
    addMedia,
    getAllMedia,
    getMovie,
    getSeries,
    getAnimation,
    getMediaById
};