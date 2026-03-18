import { Router } from "express";
import { reviewController } from "./review.controller";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/add-review", checkAuth(Role.USER), reviewController.addReview);




export const reviewRoutes = router;