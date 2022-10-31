import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import {Roan} from "roan-core";

export default async function RoanHookLift (app: Roan) {
  const IS_DEV = process.env.NODE_ENV === "development";

  const { config } = app;

  const port = IS_DEV ? (config?.devServer?.port || 9526) : (config?.server?.port || 9526);
  const host = IS_DEV ? (config?.devServer?.host || "localhost") : (config?.server?.host || "0.0.0.0");
  const appPath = config?.appPath;

  let key;
  let cert;

  try {
    key = fs.readFileSync(path.join(appPath, "ssl", "server.key"), "utf8");
    cert = fs.readFileSync(path.join(appPath, "ssl", "server.crt"), "utf8");
  } catch (err) {
    console.warn("[warning] cannot find the ssl file in this dir: " + path.join(appPath, "ssl"));
    console.warn("[warning] set the ssl file to empty");
  }

  const opts = { key, cert };

  if (IS_DEV) {
    const server = http.createServer(app.callback()).listen(port, host);
  } else {
    const server = https.createServer(opts, app.callback()).listen(port, host);
  }

  printLogo();
  log(`Server at: ${IS_DEV ? "http" : "https"}://${host}:${port}`);
  log(`Server lifted in ${appPath}`);
  log("To shut down, press <CTRL> + C at any time.\n");
}

const log = msg => process.stdout.write(msg + '\n');

const printLogo = () => log(`
  ██████╗  ██████╗  █████╗ ███╗   ██╗
  ██╔══██╗██╔═══██╗██╔══██╗████╗  ██║
  ██████╔╝██║   ██║███████║██╔██╗ ██║
  ██╔══██╗██║   ██║██╔══██║██║╚██╗██║
  ██║  ██║╚██████╔╝██║  ██║██║ ╚████║
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
`)