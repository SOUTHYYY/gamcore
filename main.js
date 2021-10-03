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
app.commandLine.appendSwitch(
  "ppapi-flash-path",
  path.join(
    __dirname,
    process.env.NODE_ENV === "production" ? `../${pluginName}` : pluginName
  )
);
app.setName("y8-browser");
// Optional: Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch("ppapi-flash-version", "11.2.999");

const openDefaultBrowser = async (link) => {
  await shell.openExternal(link);
};

const MENU_TEMPLATE = [
  {
    label: "Window Manager",
    submenu: [
      {
        label: "Go to website",
        click: () => openDefaultBrowser("https://porcore.com"),
      },
    ],
  },
  {
    label: "Porncore",
    submenu: [
      {
        label: "Go to website",
        click: () => openDefaultBrowser("https://porcore.com"),
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(MENU_TEMPLATE);

Menu.setApplicationMenu(menu);

app.on("ready", () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      plugins: true,
    },
  });
  win.loadURL(`https://ru.gamcore.com`);
});
