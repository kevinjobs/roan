import Koa from "koa";
import path from "path";
import {getHooks} from "./utils/get-hooks";
import {HookImportError} from "./utils/expections";
import {App, Params} from "./types";

const HOOKS = [
  "router",
  "lift",
]

export default async function MintServer(params: Params) {
  const app = (new Koa()) as App;
  const { appPath } = params;

  app.roan = {};
  app.roan.appPath = appPath;

  const env = process.env.NODE_ENV;

  const ext = app.roan.extName = env === "development" ? ".ts" : ".js";

  const base = await import(path.join(appPath, `config/config.base${ext}`));
  const cur = await import(path.join(appPath, `config/config.${env}${ext}`));

  app.roan.config = cur.default(app);

  const hooks = await getHooks(HOOKS);

  for (const hook of hooks) {
    try {
      await hook.default(app);
    } catch (err) {
      throw new HookImportError("something goes wrong when importing the" +
        " hook: " + hook);
    }
  }

  app.on("error", err => {});

  return app;
}