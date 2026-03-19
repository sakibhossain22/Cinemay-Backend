import { Router } from "express";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { watchlistController } from "./watchlist.controller";

const router = Router();

router.post("/", checkAuth(Role.USER), watchlistController.addToWatchlist)
router.get("/", checkAuth(Role.USER), watchlistController.getWatchlistByUserId)




export const watchListRoutes = router;