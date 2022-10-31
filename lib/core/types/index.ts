import Koa from "koa";

interface Config {
  devServer?: {
    port?: number;
    host?: number;
  };
  router?: {
    type?: "file" | "koa-router"
  }
}

export type App = {
  /**
   * store all config to the roan
   */
  roan: {
    appPath?: string;
    extName?: string;
    config?: Config;
  };
} & Koa;

export type Params = {
  /**
   * the root path of app
   */
  appPath: string;
}