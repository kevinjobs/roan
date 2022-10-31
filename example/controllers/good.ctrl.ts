import Koa from "koa";

export default class GoodController {
  static async get(ctx: Koa.Context, next: Koa.Next) {
    ctx.type = "application/json";
    ctx.body = {
      code: 0,
      msg: "success",
      data: {
        list: [
          19,
          19,
          20
        ]
      }
    }
  }
}