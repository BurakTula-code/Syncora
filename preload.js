const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        let valid = ['send-command', 'set-opacity'];
        if (valid.includes(channel)) ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
        let valid = ['media-data'];
        if (valid.includes(channel)) ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});