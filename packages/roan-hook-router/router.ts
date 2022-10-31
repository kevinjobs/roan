import glob from "glob";
import path from "path";
import compose from "koa-compose";
import {RoanApplication} from "roan-core";

export default async function RoanHookRouter (app: RoanApplication) {
  const { appPath } = app.config;

  const routerType = app.config.router?.type || "file";
  const routersPath = path.join(appPath, app.config?.router?.path || "routers");

  switch (routerType) {
    case "file":
      await handleFileRouter(app, routersPath);
      break;
    case "koa-router":
      await handleKoaRouter(app, routersPath);
      break;
  }
}

/**
 * handle the router when it's type is file.
 * @param app RoanApplication
 * @param routersPath
 */
async function handleFileRouter(app: RoanApplication, routersPath: string) {
  const appPath = app.config.appPath;
  const extName = app.config.extName;

  const pattern = replaceBackslash(path.resolve(routersPath, `**/*${extName}`));
  const fileList = glob.sync(pattern);

  let routerMap = {};
  for (let item of fileList) {
    const controller = await import(item);

    const { method, handler } = controller.default;
    const relative = path.relative(routersPath, item);
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
}

/**
 * handle the router when it's type is koa-router.
 * @param app RoanApplication
 * @param routersPath
 */
async function handleKoaRouter(app: RoanApplication, routersPath: string) {
  const appPath = app.config.appPath;
  const extName = app.config.extName;

  const pattern = replaceBackslash(path.join(routersPath, `**/*${extName}`));
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

// replace the backslash in the windows platform
function replaceBackslash(src: string) {
  if (process.platform === "win32") {
    return src.replace(/\\/g, "\/");
  }
}