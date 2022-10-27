import Koa from "koa";
import path from "path";
import { getHooks } from "./utils/get-hooks";

const HOOKS = [
  "lift",
]

type Params = {
  appPath: string;
}

export default async function MintServer(params: Params) {
  const app = new Koa();
  const { appPath } = params;
  app.appPath = appPath;

  const env = process.env.NODE_ENV;

  const ext = app.extName = env === "development" ? ".ts" : ".js";
  const base = await import(path.join(appPath, `config/config.base${ext}`));
  const cur = await import(path.join(appPath, `config/config.${env}${ext}`));
  app.config = cur.default(app);

  const hooks = await getHooks(HOOKS);
  for (const hook of hooks) {
    try {
      await hook.default(app);
    } catch (err) {

    }
  }

  app.on("error", err => {});
}