import { purchaseController } from "./purchase.controller";
import { Router } from "express";

const router = Router();

router.post("/", purchaseController.purchaseMedia)





export const purchaseRoutes = router;