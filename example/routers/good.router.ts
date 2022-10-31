import Router from "koa-router";
import GoodController from "../controllers/good.ctrl";

const router = new Router();
router.prefix("/v2");

router.get("/goods", GoodController.get)

export default router;