import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pledgesRouter from "./pledges";
import authRouter from "./auth";
import stripeRouter from "./stripe";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/pledges", pledgesRouter);
router.use("/auth", authRouter);
router.use("/stripe", stripeRouter);

export default router;
