import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pledgesRouter from "./pledges";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/pledges", pledgesRouter);

export default router;
