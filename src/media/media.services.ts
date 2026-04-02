import { IMovie, IQuery } from "./media.interface";
import { prisma } from "../lib/prisma";
import { ContentType, MediaType } from "../../generated/prisma/enums";

const addMedia = async (movie: IMovie) => {
    try {

        const { category, customId, tmdb_id, ...movieData } = movie;

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

        if (type) andConditions.push({ type: type as any });
        if (genre) andConditions.push({ genre: { has: genre } });
        if (releaseYear) andConditions.push({ releaseYear: parseInt(releaseYear as string) });
        if (rating) andConditions.push({ ratingAverage: { gte: parseFloat(rating as string) } });

        if (isPremium !== undefined) {
            const isPremiumValue = String(isPremium).toLowerCase() === 'true';

            if (isPremiumValue) {
                andConditions.push({ contentType: ContentType.PREMIUM });
            } else {
                andConditions.push({ contentType: ContentType.FREE });
            }
        }

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

        let orderBy: any = { createdAt: "desc" }; 

        if (sortBy === 'priceLow') {
            orderBy = { buyPrice: 'asc' };
        } else if (sortBy === 'priceHigh') {
            orderBy = { buyPrice: 'desc' };
        } else if (sortBy === 'newest') {
            orderBy = { createdAt: 'desc' };
        } else if (sortBy === 'rating') {
            orderBy = { ratingAverage: 'desc' };
        }

        const [data, total] = await prisma.$transaction([
            prisma.movie.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: orderBy, 
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

const getSeries = async (categoryName?: string) => {
    try {
        return await prisma.movie.findMany({
            where: {
                type: MediaType.SERIES, 
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