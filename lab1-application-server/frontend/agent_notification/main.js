const { app } = require("electron");
const WindowManager = require("./Scripts/WindowManager.js");

//Main Object responsible for managing the electron windows is created
windowManager = new WindowManager();

//Called when Electron is ready
//This creates the browser windows and tray in the menu bar
app.on("ready", windowManager.createUI.bind(windowManager));

//When all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//--- When use self-signing certificate must be uncomment this line below. ---
app.commandLine.appendSwitch("ignore-certificate-errors");

if (process.platform === "win32") {
  app.setAppUserModelId(app.name + " " + app.getVersion());
}

//-----------------------

// In main process.
const { ipcMain } = require("electron");
ipcMain.on("asynchronous-message", (event, arg) => {
  console.log(arg); // prints "ping"
  event.reply("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, arg) => {
  console.log(arg); // prints "ping"
  event.returnValue = "pong";
});
