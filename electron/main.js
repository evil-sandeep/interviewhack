const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Fix for Microphone "Network" Error in Electron
// These flags help Electron use system-native speech components
app.commandLine.appendSwitch('enable-speech-dispatcher');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('enable-features', 'WebSpeechAPI');

let mainWindow;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 550,
    height: 700,
    alwaysOnTop: true,
    skipTaskbar: false,
    frame: false,
    transparent: true,
    resizable: true,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Grant microphone permission explicitly
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true);
    }
    callback(false);
  });


  // In development, load from Vite dev server
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  const url = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../client/dist/index.html')}`;
  
  mainWindow.loadURL(url);

  // Open DevTools in dev mode if needed
  // if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
