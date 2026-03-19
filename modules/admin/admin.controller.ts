import { Request, Response } from "express";
import { adminServices } from "./admin.services";

const addCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const result = await adminServices.addCategory(data)
        res.status(200).json({
            success: true,
            message: "Category Added Successfully",
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


export const adminController = {
    addCategory,
}