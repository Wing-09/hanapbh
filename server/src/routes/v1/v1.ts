import { Router } from "express";
import user_v1_router from "./user";

const router = Router();

router.use("/user", user_v1_router);

const v1_router = router;

export default v1_router;
