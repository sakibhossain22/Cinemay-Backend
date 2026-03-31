import { Router } from "express";
import checkAuth from "../lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { watchlistController } from "./watchlist.controller";

const router = Router();

router.post("/", checkAuth(Role.USER), watchlistController.addToWatchlist)
router.get("/", checkAuth(Role.USER), watchlistController.getWatchlistByUserId)
router.delete("/:id", checkAuth(Role.USER), watchlistController.removeFromWatchlist)



export const watchListRoutes = router;