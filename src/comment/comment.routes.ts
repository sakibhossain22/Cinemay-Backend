import { Router } from "express";
import { reviewController } from "../review/review.controller";
import { Role } from "../../generated/prisma/client";
import checkAuth from "../lib/middlewares/checkAuth";
import { commentController } from "./comment.controller";

const router = Router();


router.post("/add-comment", checkAuth(Role.USER), commentController.postComment);
router.get("/:reviewId", commentController.getCommentsByReview);
router.delete("/:commentId", checkAuth(Role.USER), commentController.deleteCommentById);



export const commentRoutes = router;