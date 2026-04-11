const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add foundation APIs here if needed
  // Example: sendNotification: (message) => ipcRenderer.send('notify', message)
});
