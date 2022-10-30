export default app => {
  return {
    devServer: {
      // port: 7777
    },
    router: {
      type: "koa-router" // file or koa-router
    }
  }
}