import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pledgesRouter from "./pledges";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/pledges", pledgesRouter);
router.use("/auth", authRouter);

export default router;
