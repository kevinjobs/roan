import { RoanApplication, Config } from "Params";

export default function DevConfig(app: RoanApplication) :Config {
  return {
    devServer: {
      // port: 7777
    },
    router: {
      type: "koa-router" // file or koa-router
    }
  }
}