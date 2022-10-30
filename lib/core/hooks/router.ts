import glob from "glob";
import path from "path";
import compose from "koa-compose";
import {App} from "../types";

// replace the backslash in the windows platform
function replaceBackslash(src: string) {
  if (process.platform === "win32") {
    return src.replace(/\\/g, "\/");
  }
}

export default async function RouteHook (app: App) {
  const { roan } = app;
  const { appPath, extName } = roan;
  const routerType = roan?.config?.router?.type || "file";

  const controllerPath = path.join(appPath, "controllers");
  const pattern = replaceBackslash(path.resolve(controllerPath, `**/*${extName}`));
  const fileList = glob.sync(pattern);

  if (routerType === "file") {
    let routerMap = {};
    for (let item of fileList) {
      const controller = await import(item);

      const { method, handler } = controller.default;
      const relative = path.relative(controllerPath, item);
      const extname = path.extname(item);

      const fileRouter = replaceBackslash("/" + relative.split(extname)[0]);
      const key = "_" + method + "_" + fileRouter;

      routerMap[key] = handler;
    }

    app.use(async (ctx, next) => {
      const { path, method } = ctx;
      const key = "_" + method + "_" + path;
      if (routerMap[key]) {
        await routerMap[key](ctx);
      } else {
        ctx.body = "no this router";
      }
      return next();
    })
  } else if (routerType === "koa-router") {
    const pattern = replaceBackslash(path.resolve(appPath, "./routers", `**/*${extName}`));
    const routerFiles = glob.sync(pattern);
    const register = async () => {
      let routers = [];
      for (let file of routerFiles) {
        const router = await import(file);
        routers.push(router.default.routes());
      }
      return compose(routers);
    }
    app.use(await register());
  }
}