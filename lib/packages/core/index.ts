import Koa from "koa";
import path from "path";
import RoanHookLift from "roan-hook-lift";
import RoanHookRouter from "roan-hook-router";

export type NODE_ENV = "development" | "production" | "test";

export interface Config {
  /**
   * roan server root path
   */
  appPath?: string;
  /**
   * file extension name, depends on process.env.NODE_ENV
   */
  extName?: string;
  env?: NODE_ENV;
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

export type Roan = {
  config: Config;
  /**
   * you can load something else here
   */
  ext?: any;
} & Koa;
export type Params = Pick<Config, "appPath" | "server" | "router">;

export default async function RoanServer(params: Params) :Promise<Roan> {
  const { appPath } = params;
  const env = process.env.NODE_ENV as NODE_ENV;
  const extName = env === "development" ? ".ts" : ".js";

  const app = (new Koa()) as Roan;

  app.ext = {};
  app.config = { appPath, env, extName };

  const configs = await getConfig(app);
  app.config = {...app.config, ...configs};

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
  const {appPath, extName, env} = app.config;

  const base = await import(path.join(appPath, `config/config.base${extName}`));
  const cur = await import(path.join(appPath, `config/config.${env}${extName}`));

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