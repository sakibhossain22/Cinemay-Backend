import { Request, Response } from "express";
import { mediaService } from "./media.services";

const addMedia = async (req: Request, res: Response) => {
    try {
        const result = await mediaService.addMedia(req.body);
        res.status(200).json({
            success: true,
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


export const mediaController = {
    addMedia,
}