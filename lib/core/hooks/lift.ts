import {App} from "../types";

export default async function (app: App) {
  const { roan } = app;
  const port = roan?.config?.devServer?.port || 9526;
  const appPath = roan?.appPath;

  app.listen(port, () => {
    printLogo();
    log(`Server port ${port}`);
    log(`Server lifted in ${appPath}`);
    log("To shut down, press <CTRL> + C at any time.\n");
  })
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