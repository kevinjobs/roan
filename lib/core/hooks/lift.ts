export default async function (app) {
  const port = app.config.devServer.port;
  app.listen(port, () => {
    printLogo();
    log(`Server port ${port}`);
    log(`Server lifted in ${app.appPath}`);
    log("To shut down, press <CTRL> + C at any time.\n");
  })
}

const log = msg => process.stdout.write(msg + '\n');

const printLogo = () => log(`
   Hello, World!
`)