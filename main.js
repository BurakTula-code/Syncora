const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const WebSocket = require('ws');

let mainWindow;
let wss;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 115, // 1. HATA: 800 çok büyüktü, 115px senin 95px'lik widget'ın için ideal
        frame: false, // 2. HATA: Widget görünümü için çerçeveyi kapattık
        transparent: true, // 3. HATA: Beyaz arka planı yok edip transparan yapar
        alwaysOnTop: true, // Widget'ın her zaman üstte durmasını sağlar
        resizable: false,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

function setupWebSocket() {
    wss = new WebSocket.Server({ port: 8091 });

    wss.on('connection', function connection(ws) {
        ws.isAlive = true;
        ws.on('pong', () => { ws.isAlive = true; });

        ws.on('message', function incoming(message) {
            if (mainWindow && mainWindow.webContents) {
                mainWindow.webContents.send('media-update', message.toString());
            }
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        });
    });

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', function close() { clearInterval(interval); });
}

ipcMain.on('send-command', (event, command) => {
    if (wss) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(command);
            }
        });
    }
});

// 4. HATA: Opaklık ayarı zaten 0.2-1.0 arasında geliyor, 100'e bölmene gerek yok
ipcMain.on('set-opacity', (event, value) => {
    if (mainWindow) {
        mainWindow.setOpacity(parseFloat(value)); 
    }
});

app.whenReady().then(() => {
    createWindow();
    setupWebSocket();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});