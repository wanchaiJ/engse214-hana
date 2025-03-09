const {
  app,
  BrowserWindow,
  screen,
  Tray,
  nativeImage,
  Menu,
  ipcMain,
  dialog,
} = require("electron");
//const helper = require('./HelperFunctions.js');
const path = require("path");
let imgPath;
const AppNameVersion = app.getName() + " " + app.getVersion();
const win_width = 520; //320
const win_height = 310; //210

class WindowManager {
  constructor() {
    //super(props)
    this.state = { isReady: false };

    //Iconpaht different in Build
    //imgPath = helper.isDev() ? './assets/agent_notification.png' : path.join(__dirname, '../assets/agent_notification.png');

    imgPath = "./assets/agent_notification.png";

    this.icon = nativeImage.createFromPath(imgPath);
  }

  createIPC() {
    ipcMain.on("close-me", (evt, arg) => {
      app.quit();
    });

    ipcMain.on("hide-me", (evt, arg) => {
      this.hideWindow();
    });

    ipcMain.on("show-me", (evt, arg) => {
      this.showWindow();
    });

    //--------------------------------
  }

  //Creates a Tray and a Windows
  createUI() {
    if (process.platform == "darwin") app.dock.hide();

    this.createTray();
    this.createMainWindow();
    this.createIPC();
  }

  closeApp() {
    if (app.showExitPrompt) {
      e.preventDefault(); // Prevents the window from closing
      dialog.showMessageBox(
        {
          type: "question",
          buttons: ["Yes", "No"],
          title: "Confirm",
          message: "Unsaved data will be lost. Are you sure you want to quit?",
        },
        function (response) {
          if (response === 0) {
            // Runs the following if 'Yes' is clicked
            app.showExitPrompt = false;
            mainWindow.close();
          }
        }
      );
    }
  }

  createTray() {
    this.tray = new Tray(this.icon);
    this.tray.getTitle("Agent Notification");

    this.tray.on("double-click", this.toggleWindowMain.bind(this));

    const contextMenu = Menu.buildFromTemplate([
      { label: AppNameVersion, enabled: false },
      { type: "separator" },
      { label: AppNameVersion, enabled: false },
      { type: "separator" },
      {
        label: "Configuration",
        click: () => {
          this.showWindow();
        },
      },
      {
        label: "Agent Code",
        click: () => {
          this.showWindow();
        },
      },
      {
        label: "close",
        click: () => {
          this.hideWindow();
        },
      },
      { type: "separator" },
      // { label: 'x86 Chrome', type: 'radio' },
      {
        label: "Exit",
        click: () => {
          this.exitWindow();
        },
      },
    ]);

    this.tray.setToolTip(AppNameVersion);
    this.tray.setContextMenu(contextMenu);

    if (process.platform == "darwin")
      this.tray.setIgnoreDoubleClickEvents(true); //Better UX on MacOS
  }

  createMainWindow() {
    this.win = new BrowserWindow({
      icon: "assets/agent_notification.png",
      width: win_width,
      height: win_height,
      // backgroundColor: '#E5E8E8', // background color
      title: AppNameVersion,
      // frame: true,
      // show: true,
      // fullscreenable: false,
      // movable: true,
      resizable: true,
      // transparent: true,
      // maximazable: false,
      menu: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        plugins: true,
        devTools: true,
        contextIsolation: false,
      },
      skipTaskbar: false,
    });

    this.win.webContents.openDevTools();

    this.win.loadFile("index.html"); /*---- */
    this.win.setVisibleOnAllWorkspaces(true);
    this.win.setAlwaysOnTop(true, "screen");
    this.win.setMenu(null);
    this.showMainWindow(); /*---- */

    this.win.setFullScreenable(false);
    this.win.setMaximizable(false);
    this.win.isResizable(false);

    this.win.on("close", function (e) {
      const choice = require("electron").dialog.showMessageBoxSync(this.win, {
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message: "Are you sure you want to exit ?",
      });
      if (choice === 1) {
        e.preventDefault();
      }
    });
  }

  hideWindow() {
    this.win.hide();
  }

  exitWindow() {
    this.win.close();
    app.exit(0);
  }

  showWindow() {
    this.win.show();
  }

  getWindowPosition() {
    const windowBounds = this.win.getBounds();
    const trayBounds = this.tray.getBounds();

    let x = 0;
    let y = 0;

    console.log(
      "(mac) windowBounds.width=" +
        windowBounds.width +
        ", (mac) windowBounds.height=" +
        windowBounds.height
    );
    console.log(
      "(mac) trayBounds.width=" +
        trayBounds.width +
        ", (mac) trayBounds.height=" +
        trayBounds.height
    );

    //MacOS
    if (process.platform != "win32") {
      // Center window horizontally below the tray icon
      x = Math.round(
        trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
      );
      // Position window 4 pixels vertically below the tray icon
      y = Math.round(trayBounds.y + trayBounds.height + 4);

      console.log("(mac) X=" + x + ", (mac) Y=" + y);

      return {
        x: x - 338,
        y: y,
      };
    }
    //On Windows the Task bar is sadly very flexible
    else {
      let display = screen.getPrimaryDisplay();
      let width = display.bounds.width;
      let height = display.bounds.height;
      //console.log("(win) X="+width - 231 + ", (win) Y=" + 1);
      console.log("(win) X=" + width + ", (win) Y=" + height);

      return {
        x: width - win_width,
        y: height - (win_height + 50),
      };
    }
  }

  showMainWindow() {
    const position = this.getWindowPosition();
    //console.log("X="+position.x + ", Y=" + position.y);
    this.win.setPosition(position.x, position.y);
    this.win.show();
    this.win.focus();

    //This is necessary for the window to appear on windows
    if (process.platform == "win32") {
      this.win.moveTop();
    }
  }

  toggleWindowMain() {
    if (this.win.isVisible()) {
      this.win.hide();
    } else {
      this.showMainWindow();
    }
  }
}

module.exports = WindowManager;
