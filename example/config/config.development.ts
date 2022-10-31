import {Roan, Config} from "roan-core";

export default function DevConfig(app: Roan) :Config {
  return {
    devServer: {
      // port: 7777
    },
    router: {
      type: "koa-router" // file or koa-router
    }
  }
}