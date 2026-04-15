const { app, BrowserWindow, session, ipcMain } = require('electron');
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

  // Mask identity as standard Chrome to bypass WebSpeech blocks
  mainWindow.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  // Advanced Permission Handlers
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['media', 'audioCapture', 'mediaKeySystem'];
    if (allowedPermissions.includes(permission)) {
      return callback(true);
    }
    callback(false);
  });

  session.defaultSession.setPermissionCheckHandler((webContents, permission, origin) => {
    const allowedPermissions = ['media', 'audioCapture', 'mediaKeySystem'];
    if (allowedPermissions.includes(permission)) {
      return true;
    }
    return false;
  });



  // In development, load from Vite dev server
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  console.log(`[Electron] Starting in ${isDev ? 'Development' : 'Production'} mode`);
  
  const url = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../client/dist/index.html')}`;
  console.log(`[Electron] Loading URL: ${url}`);
  
  // Advanced Logging for debugging blank screens
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`[Electron] Failed to load URL: ${validatedURL}`);
    console.error(`[Electron] Error: ${errorDescription} (${errorCode})`);
    
    // Fallback if localhost is failing
    if (isDev && validatedURL.includes('localhost')) {
      console.log("[Electron] Attempting fallback to 127.0.0.1...");
      mainWindow.loadURL(url.replace('localhost', '127.0.0.1'));
    }
  });

  // Open DevTools immediately in dev mode to catch early errors
  /* if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    console.log("[Electron] DevTools opened");
  } */

  // Use ready-to-show to prevent blank/unpainted window frames
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(url);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // IPC handlers for window controls
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
