import { IMovie, IQuery } from "./media.interface";
import { prisma } from "../../src/lib/prisma";
import { MediaType } from "../../generated/prisma/enums";

const addMedia = async (movie: IMovie) => {
    try {
        const res = await prisma.movie.create({
            data: movie
        });
        return res;
    } catch (error) {
        throw new Error("Failed to Add Media");
    }

}
const getAllMedia = async (query: IQuery) => {
    try {
        const { genre, releaseYear, rating, searchTerm, type, page = 1, limit = 10 } = query;
        console.log(searchTerm)
        // Pagination calculation
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const whereCondition: any = {
            AND: [
                type ? { type: type as any } : {},
                genre ? { genre: { has: genre } } : {},
                releaseYear ? { releaseYear: parseInt(releaseYear) } : {},
                rating ? { ratingAverage: { gte: parseFloat(rating) } } : {},
                searchTerm ? {
                    OR: [
                        { title: { contains: searchTerm, mode: "insensitive" } },
                        { director: { contains: searchTerm, mode: "insensitive" } },
                        { cast: { has: searchTerm } }
                    ],
                } : {},
            ],
        };

        // Fetch data and total count simultaneously
        const [data, total] = await prisma.$transaction([
            prisma.movie.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: { reviews: true } // যদি ক্যাটাগরি ডিটেইলস লাগে
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
const getMovie = async () => {
    try {
        const res = await prisma.movie.findMany({
            where: {
                type: MediaType.MOVIE
            }
        });
        console.log(res)
        return res;
    } catch (error) {
        throw new Error("Failed to Get All Media");
    }

}
const getSeries = async () => {
    try {
        const res = await prisma.movie.findMany({
            where: {
                type: MediaType.SERIES
            }
        });
        return res;
    } catch (error) {
        throw new Error("Failed to Get All Series");
    }
}
const getMediaById = async (id: string) => {
    try {
        const res = await prisma.movie.findUnique({
            where: {
                id
            },
            include: {
                reviews: {
                    include: {
                        user: true
                    }
                },
                categories: true
            } // যদি ক্যাটাগরি ডিটেইলস লাগে

        });
        return res;
    } catch (error) {
        throw new Error("Failed to Get Media by id");
    }
}


export const mediaService = {
    addMedia,
    getAllMedia,
    getMovie,
    getSeries,
    getMediaById
}