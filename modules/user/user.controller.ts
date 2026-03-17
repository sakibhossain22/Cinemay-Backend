import { Request, Response } from "express";

const addMedia = async (req: Request, res: Response) => {
    try {

        res.status(200).json({
            success: true,
            ok: true,
            
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