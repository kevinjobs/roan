import Koa from "koa";
import path from "path";
import RoanHookLift from "roan-hook-lift";
import RoanHookRouter from "roan-hook-router";

export interface Config {
  /**
   * roan server root path
   */
  appPath?: string;
  /**
   * file extension name, depends on process.env.NODE_ENV
   */
  extName?: string;
  /**
   * server of production environment;
   * default port is 9526;
   * default host is 0.0.0.0
   */
  server?: {
    port?: number;
    host?: string;
  };
  /**
   * development server
   */
  devServer?: {
    port?: number;
    host?: string;
  };
  /**
   * router;
   * you can set routers path specific
   */
  router?: {
    type?: "file" | "koa-router";
    path?: string;
  }
}

export type Roan = { config: Config; } & Koa;
export type Params = Pick<Config, "appPath" | "server" | "router">;

export default async function RoanServer(params: Params) :Promise<Roan> {
  const app = (new Koa()) as Roan;
  const { appPath } = params;

  app.config = {};
  app.config.appPath = appPath;
  app.config = {...app.config, ...(await getConfig(app))};

  await RoanHookLift(app);
  await RoanHookRouter(app);

  handleEvents(app);
  return app;
}

/**
 * get config from config path
 * @param app Roan
 */
async function getConfig(app: Roan) {
  const appPath = app.config.appPath;
  const env = process.env.NODE_ENV;

  const IS_DEV = env === "development"
  const ext = app.config.extName = IS_DEV ? ".ts" : ".js";

  const base = await import(path.join(appPath, `config/config.base${ext}`));
  const cur = await import(path.join(appPath, `config/config.${env}${ext}`));

  return merge(base.default(app), cur.default(cur));
}

/**
 * merge config
 * @param base base config
 * @param other another config
 */
function merge(base: Config, other: Config) :Config {
  return {...base, ...other};
}

/**
 * handle app events, like "error", etc..
 * @param app Roan
 */
function handleEvents(app: Roan) {
  app.on("error", err => {});
}