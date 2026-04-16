const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;
let activeWs = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 420, height: 95,
        alwaysOnTop: true, transparent: true, frame: false, resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow();
    const wss = new WebSocket.Server({ port: 8091, host: '127.0.0.1' });
    wss.on('connection', (ws) => {
        activeWs = ws;
        ws.on('message', (message) => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('media-data', message.toString());
            }
        });
    });

    ipcMain.on('send-command', (event, cmd) => {
        if (activeWs && activeWs.readyState === WebSocket.OPEN) activeWs.send(cmd);
    });

    ipcMain.on('set-opacity', (event, value) => {
        if (mainWindow) mainWindow.setOpacity(parseFloat(value));
    });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });