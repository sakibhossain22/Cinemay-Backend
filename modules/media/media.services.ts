import { PrismaPg } from "@prisma/adapter-pg";
import { IMovie } from "./media.interface";
import { prisma } from "../../src/lib/prisma";

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

export const mediaService = {
    addMedia,
}