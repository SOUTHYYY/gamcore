const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

// Specify flash path, supposing it is placed in the same directory with main.js.
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

console.log("DIRNAME", __dirname);
console.log(process.env.NODE_ENV);
// process.env.NODE_ENV === "production" ? `../${pluginName}` : pluginName;

app.commandLine.appendSwitch(
  "ppapi-flash-path",
  path.join(__dirname, `../${pluginName}`)
);
app.setName("gamcore-browser");
// Optional: Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch("ppapi-flash-version", "11.2.999");

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
          accelerator: `${
            process.platform === "darwin" ? "Cmd+Ctrl+f" : "Ctrl+f11"
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
