const { app, BrowserWindow, Menu, shell } = require("electron");
const log = require('electron-log');
const path = require("path");
const Sentry = require("@sentry/electron");

Sentry.init({ dsn: "https://aeaa2257bb6f48ef9884c0b63ad11882@browser.gamcore.com/3" });
let pluginName;
switch (process.platform) {
  case "win32":
    pluginName = "pepflashplayer.dll";
    break;
  case "darwin":
    pluginName = "PepperFlashPlayer.plugin";
    break;
  case "linux":
    pluginName = "libpepflashplayer.so";
    break;
}

log.log(`Platform: ${process.platform}. Get plugin ${pluginName}`)
log.log(`Dirname: ${__dirname}`)
log.log(`Enviroment: ${process.env.NODE_ENV}`)

log.log(`Trying to apply plugin`)
try {
  app.commandLine.appendSwitch(
    "ppapi-flash-path",
    path.join(__dirname, `../${pluginName}`)
  );
  app.setName("gamcore-browser");
  app.commandLine.appendSwitch("ppapi-flash-version", "11.2.999");
  log.log(`Success apply plugin`)
} catch (err) {
  Sentry.captureException(`Error apply plugin ${err}`);
}

app.on("ready", () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      plugins: true,
    },
  });

  const openDefaultBrowser = async (link) => {
    await shell.openExternal(link);
  };

  const openFolderPath = async () => {
    const { USER } = process.env
    let path;
    switch (process.platform) {
      case "win32":
        path = `C:\\Users\\${USER}\\AppData\\Roaming\\Gamcore\\logs\\main.log`
        break;
      case "darwin":
        path = `/Users/${USER}/Library/Logs/Gamcore/main.log`;
        break;
    }
    log.log(`User Path: ${path}`)
    shell.showItemInFolder(path)
  }

  const MENU_TEMPLATE = [
    {
      label: "Gamcore",
      submenu: [
        {
          label: "Homepage",
          click: function () {
            win.loadURL("https://gamcore.com");
          },
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function () {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:",
        },
      ],
    },
    {
      label: "Screen",
      submenu: [
        {
          label: "Full Screen",
          accelerator: `${process.platform === "darwin" ? "Cmd+Ctrl+f" : "Ctrl+f11"
            }`,
          click: () => toggleFullscreen(),
        },
      ],
    },
    {
      label: "Porn Websites",
      submenu: [
        {
          label: "Gamcore",
          click: () =>
            openDefaultBrowser("https://gamcore.com/?utm_source=browser"),
        },
        {
          label: "Porcore",
          click: () =>
            openDefaultBrowser("https://porcore.com/?utm_source=browser"),
        },
      ],
    },
    {
      label: "Debug",
      submenu: [
        {
          label: "Open Debug Folder",
          click: async () => await openFolderPath()

        }
      ],
    },
  ];

  function toggleFullscreen() {
    if (win.isFullScreen()) {
      win.setFullScreen(false);
    } else {
      win.setFullScreen(true);
    }
  }

  win.maximize();
  win.loadURL(`https://gamcore.com`);

  const menu = Menu.buildFromTemplate(MENU_TEMPLATE);

  Menu.setApplicationMenu(menu);
});
