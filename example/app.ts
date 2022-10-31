import RoanServer, {Config} from "roan-core";
import path from "path";

const config: Config = {
  appPath: __dirname,
  server: {
    host: "0.0.0.0",
    port: 8888
  },
  router: {
    type: "koa-router",
    path: path.join(__dirname, "./routers")
  }
}

const app = RoanServer(config);

export default app;