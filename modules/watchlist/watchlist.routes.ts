import { Router } from "express";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { watchlistController } from "./watchlist.controller";

const router = Router();

// router.get("/", checkAuth(Role.USER), watchlistController.addToWatchlist)
router.post("/", checkAuth(Role.USER), watchlistController.addToWatchlist)




export const watchListRoutes = router;