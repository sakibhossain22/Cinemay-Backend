import { Router } from "express";
import { reviewController } from "./review.controller";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.get("/", reviewController.getAllReviews);
router.post("/like-review", checkAuth(Role.USER), reviewController.addLikeInReview);
// Comment Routes


router.post("/add-review", checkAuth(Role.USER), reviewController.addReview);
router.patch("/:reviewId", checkAuth(Role.USER), reviewController.editReview);
router.delete("/:reviewId", checkAuth(Role.USER), reviewController.deleteReview);




export const reviewRoutes = router;