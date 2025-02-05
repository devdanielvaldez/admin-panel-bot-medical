const isProd = process.env.NODE_ENV === "production";

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 680
      })
      if (isProd) {
        await mainWindow.loadURL("app://./");
      } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}`);
      }
}