import { RoanOptions } from "../typings";

export const DEFAULT_OPTIONS: RoanOptions = {
  rootPath: ".",
  port: 8080,
  host: "0.0.0.0",
  devServer: {
    port: 9526,
    host: "localhost"
  },
  routerType: "file",
}