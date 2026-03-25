import { Request, Response } from "express";
import { adminServices } from "./admin.services";
import { AppError } from "../../src/error/AppError";

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
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Add Media"
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
const getTheMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminServices.getTheMovie(id as string)
        res.status(200).json({
            success: true,
            message: "The Movie DB Movie Retrieved Successfully",
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Retrieve Movie"
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
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllUsers()
        res.status(200).json({
            success: true,
            message: "Users Retrieved Successfully",
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Retrieve Users"
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
const getAllReviews = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllReviews()
        res.status(200).json({
            success: true,
            message: "Reviews Retrieved Successfully",
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Retrieve Reviews"
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
const getAllPayments = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllPayments()
        res.status(200).json({
            success: true,
            message: "Payments Retrieved Successfully",
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Retrieve Payments"
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
        const result = await adminServices.getAllMedia()
        res.status(200).json({
            success: true,
            message: "Media Retrieved Successfully",
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Retrieve Media"
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
const getAllComments = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllComments()
        res.status(200).json({
            success: true,
            message: "Comments Retrieved Successfully",
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Retrieve Comments"
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
const getAllWatchlists = async (req: Request, res: Response) => {
    try {
        const result = await adminServices.getAllWatchlists()
        res.status(200).json({
            success: true,
            message: "Watchlists Retrieved Successfully",
            ok: true,
            data: result
        })

    } catch (error) {
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Retrieve Watchlists"
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
const editMedia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await adminServices.editMedia(id as string, data);
        res.status(200).json({
            success: true,
            message: "Media Updated Successfully",
            ok: true,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof AppError) ? error.message : "Failed to Update Media";
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};
const deleteMedia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminServices.deleteMedia(id as string);
        res.status(200).json({
            success: true,
            message: "Media Deleted Successfully",
            ok: true,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Delete Media";
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};
const updateReviewStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await adminServices.updateReviewStatus(id as string, status);
        res.status(200).json({
            success: true,
            message: "Review Status Updated Successfully",
            ok: true,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Update Review Status";
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};
const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminServices.deleteReview(id as string);
        res.status(200).json({
            success: true,
            message: "Review Deleted Successfully",
            ok: true,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Delete Review";
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};
const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminServices.deleteUser(id as string);
        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
            ok: true,
            data: result
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Delete User";
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};
const banUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const status = req.body.status;
        const result = await adminServices.banUser(id as string, status);
        res.status(200).json({
            success: true,
            message: "User Status Updated Successfully",
            ok: true,
            data: result
        });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Update User Status";
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};
const deleteComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminServices.deleteComment(id as string);
        res.status(200).json({
            success: true,
            message: "Comment Deleted Successfully",
            ok: true,
            data: result
        });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to Delete Comment";
        res.status(500)
            .json(
                {
                    success: false,
                    data: null,
                    error: errorMessage
                }
            );
    }
};


export const adminController = {
    addCategory,
    getTheMovie,
    getAllUsers,
    getAllReviews,
    getAllPayments,
    getAllMedia,
    getAllComments,
    getAllWatchlists,
    editMedia,
    deleteMedia,
    updateReviewStatus,
    deleteReview,
    deleteUser,
    banUser,
    deleteComment,
}