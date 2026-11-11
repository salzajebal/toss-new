import { Router, type IRouter } from "express";
import healthRouter from "./health";
import applicationsRouter from "./applications";
import adminRouter from "./admin";
import eventRouter from "./event";

const router: IRouter = Router();

router.use(healthRouter);
router.use(applicationsRouter);
router.use(adminRouter);
router.use(eventRouter);

export default router;
