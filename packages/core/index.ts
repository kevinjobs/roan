import Koa from "koa";
import path from "path";
import { RoanOptions, Config } from "./typings";
import { DEFAULT_OPTIONS } from "./constant";

export default class RoanCore extends Koa {
  public config: Config = null;

  constructor(private options?: RoanOptions) {
    super();
    this.options = {...DEFAULT_OPTIONS, ...options}
    this.init();
  }

  private async init() {
    this.config = await this.getConfig(this.options.rootPath);
  }

  private async getConfig(rootPath: string) {
    const env = process.env.NODE_ENV;
    const extName = env === "production" ? ".js" : ".ts";

    const base = await import(path.join(rootPath, `config/config.base${extName}`));
    const cur = await import(path.join(rootPath, `config/config.${env}${extName}`));

    return {...base, ...cur};
  }
}
