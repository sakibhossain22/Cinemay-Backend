import { Request, Response } from "express";
import { mediaService } from "./media.services";

const addMedia = async (req: Request, res: Response) => {
    try {
        const result = await mediaService.addMedia(req.body);
        res.status(200).json({
            success: true,
            message: "Media Added Successfully",
            ok: true,
            data: result
        })


    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Add Media"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const getAllMedia = async (req: Request, res: Response) => {
    try {
        const result = await mediaService.getAllMedia(req.query as any );
        res.status(200).json({
            success: true,
            message: "All Media Retrieved Successfully",
            ok: true,
            data: result
        })


    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Get  Media"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const getMovie = async (req: Request, res: Response) => {
    try {
        const result = await mediaService.getMovie();
        res.status(200).json({
            success: true,
            message: "Movie Retrieved Successfully",
            ok: true,
            data: result
        })


    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Get  Movie"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const getSeries = async (req: Request, res: Response) => {
    try {
        const result = await mediaService.getSeries();
        res.status(200).json({
            success: true,
            message: "Series Retrieved Successfully",
            ok: true,
            data: result
        })


    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Get  Series"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const getAnimation = async (req: Request, res: Response) => {
    try {
        const result = await mediaService.getAnimation();
        res.status(200).json({
            success: true,
            message: "Animation Retrieved Successfully",
            ok: true,
            data: result
        })


    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Get  Animation"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}
const getMediaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await mediaService.getMediaById(id as string);
        res.status(200).json({
            success: true,
            message: "Media Retrieved Successfully",
            ok: true,
            data: result
        })


    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Get  Media by id"
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
}


export const mediaController = {
    addMedia,
    getAllMedia,
    getMovie,
    getSeries,
    getAnimation,
    getMediaById

}