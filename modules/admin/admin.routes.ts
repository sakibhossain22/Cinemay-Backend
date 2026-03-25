import { Router } from "express";
import { adminController } from "./admin.controller";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.get("/tmdb-movie/:id", checkAuth(Role.ADMIN), adminController.getTheMovie)
router.get("/all-users", checkAuth(Role.ADMIN), adminController.getAllUsers)
router.get("/all-reviews", checkAuth(Role.ADMIN), adminController.getAllReviews)
router.get("/all-payments", checkAuth(Role.ADMIN), adminController.getAllPayments)
router.get("/all-media", checkAuth(Role.ADMIN), adminController.getAllMedia)
router.get("/all-comments", checkAuth(Role.ADMIN), adminController.getAllComments)
router.get("/all-watchlists", checkAuth(Role.ADMIN), adminController.getAllWatchlists)
router.post("/add-category", checkAuth(Role.ADMIN), adminController.addCategory)
router.patch("/edit-media/:id", checkAuth(Role.ADMIN), adminController.editMedia)
router.patch("/update-review-status/:id", checkAuth(Role.ADMIN), adminController.updateReviewStatus)
router.patch("/update-user-status/:id", checkAuth(Role.ADMIN), adminController.banUser)
router.delete("/delete-media/:id", checkAuth(Role.ADMIN), adminController.deleteMedia)
router.delete("/delete-review/:id", checkAuth(Role.ADMIN), adminController.deleteReview)
router.delete("/delete-user/:id", checkAuth(Role.ADMIN), adminController.deleteUser)
router.delete("/delete-comment/:id", checkAuth(Role.ADMIN), adminController.deleteComment)

export const adminRoutes = router;