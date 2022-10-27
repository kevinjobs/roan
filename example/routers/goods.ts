import Router from "koa-router";

const router = new Router();
router.prefix("/v2");
router.get("/goods", (ctx, next) => {
  ctx.body = "hello, goods";
})

export default router;