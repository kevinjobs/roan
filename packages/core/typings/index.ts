export interface Config {}

export interface Database {}

export interface RoanOptions {
  rootPath?: string;
  port?: number;
  host?: string;
  devServer?: {
    port: number;
    host: string;
  };
  routerType?: "file" | "koa-router";
}
