import glob from "glob";
import path from "path";
import compose from "koa-compose";

// replace the backslash
function replaceBackslash(src: string) {
  return src.replace(/\\/g, "\/");
}

export default async (app) => {
  const { router="file" } = app.config;
  const controllerPath = path.join(app.appPath, "controllers");
  const pattern = replaceBackslash(path.resolve(controllerPath, `**/*${app.extName}`));
  const fileList = glob.sync(pattern);

  if (router === "file") {
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
  } else if (router === "koa-router") {
    const pattern = replaceBackslash(path.resolve(app.appPath, "./routers", `**/*${app.extName}`));
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