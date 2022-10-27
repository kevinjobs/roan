export default app => {
  return {
    devServer: {
      port: 8888
    },
    router: "koa-router" // file or koa-router
  }
}