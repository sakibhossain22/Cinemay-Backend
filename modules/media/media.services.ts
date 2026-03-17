import { PrismaPg } from "@prisma/adapter-pg";
import { IMovie } from "./media.interface";
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
const getAllMedia = async () => {
    try {
        const res = await prisma.movie.findMany();
        return res;
    } catch (error) {
        throw new Error("Failed to Get All Media");
    }

}
const getMovie = async () => {
    try {
        const res = await prisma.movie.findMany({
            where: {
                type: MediaType.MOVIE
            }
        });
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
            }

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