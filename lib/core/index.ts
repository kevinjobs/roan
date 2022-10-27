import Koa from "koa";
import path from "path";

type Params = {
  appPath: string;
}

export default async function MintServer(params: Params) {
  const app = new Koa;
  const { appPath } = params;
  app.appPath = appPath;

  const env = process.env.NODE_ENV;
  const ext = app.extName = env === "development" ? ".ts" : ".js";
  const base = await import(path.join(appPath, `config/config.base&{ext}`));
  const cur = await import(path.join(appPath, `config/config.${env}${ext}`));
  app.config = base.default(app) + cur.default(app);
}