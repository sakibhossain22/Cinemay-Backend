import express from "express";
import { Role } from "../../generated/prisma/enums";
import checkAuth from "../lib/middlewares/checkAuth";
import { historyController } from "./history.controller";

const router = express.Router();

router.post("/",checkAuth(Role.USER), historyController.trackView);
router.get("/",checkAuth(Role.USER), historyController.getHistory);
router.delete("/clear",checkAuth(Role.USER), historyController.clearHistory);

export const HistoryRoutes = router;