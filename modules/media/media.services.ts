import { IMovie, IQuery } from "./media.interface";
import { prisma } from "../../src/lib/prisma";
import { ContentType, MediaType } from "../../generated/prisma/enums";

// ১. মিডিয়া অ্যাড করা (Category সহ)
const addMedia = async (movie: IMovie) => {
    try {
        const { category, customId, tmdb_id, ...movieData } = movie;

        // Custom ID (Slug) জেনারেশন
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

        const res = await prisma.movie.create({
            data: {
                ...movieData,
                // Enum Case Fix (সব বড় হাতের)
                type: movie.type as MediaType,
                contentType: movie.contentType as ContentType,
                tmdb_id: tmdb_id || (movie as any).tmdb_id,
                customid: generatedCustomId,
                categories: {
                    connectOrCreate: category?.map((catName) => ({
                        where: { name: catName.toUpperCase() }, // ক্যাটাগরি নাম Uppercase রাখা সেফ
                        create: { name: catName.toUpperCase() },
                    })) || [],
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
        const { category, genre, releaseYear, rating, searchTerm, type, page = 1, limit = 10 } = query;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const whereCondition: any = {
            AND: [
                type ? { type: type as any } : {},
                genre ? { genre: { has: genre } } : {},
                releaseYear ? { releaseYear: parseInt(releaseYear as string) } : {},
                rating ? { ratingAverage: { gte: parseFloat(rating as string) } } : {},
                // ক্যাটাগরি অনুযায়ী ফিল্টার
                category ? {
                    categories: {
                        some: { name: { contains: category as string, mode: "insensitive" } }
                    }
                } : {},
                searchTerm ? {
                    OR: [
                        { title: { contains: searchTerm as string, mode: "insensitive" } },
                        { director: { contains: searchTerm as string, mode: "insensitive" } },
                        { cast: { has: searchTerm as string } }
                    ],
                } : {},
            ],
        };

        const [data, total] = await prisma.$transaction([
            prisma.movie.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: { createdAt: "desc" },
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
        throw new Error("Failed to Get Filtered Media");
    }
};

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