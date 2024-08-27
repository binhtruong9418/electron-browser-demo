const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    loadUrl: (url) => ipcRenderer.send('load-url', url),
    goBack: () => ipcRenderer.send('go-back'),
    goForward: () => ipcRenderer.send('go-forward'),
    reload: () => ipcRenderer.send('reload'),
    goHome: () => ipcRenderer.send('go-home'),
    newWindow: () => ipcRenderer.send('new-window'),
    onLoadUrlInWebview: (callback) => ipcRenderer.on('load-url-in-webview', callback),
    onUpdateUrlBar: (callback) => ipcRenderer.on('update-url-bar', callback),
    updateUrlBar: (url) => ipcRenderer.send('update-url-bar', url)
});