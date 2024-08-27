const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

let mainWindow;

app.disableHardwareAcceleration()
let windows = [];

function createWindow() {
    newWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            preload: path.join(__dirname, 'src/preload.js')
        }
    });


    // Make the window full screen
    newWindow.maximize();


    newWindow.loadFile(path.join(__dirname, 'src/index.html')).then(
        r => console.log("Loaded index.html")
    );


    // Handle IPC messages
    ipcMain.on('load-url', (event, url) => {
        newWindow.webContents.send('load-url-in-webview', url);
    });

    ipcMain.on('update-url-bar', (event, url) => {
        newWindow.webContents.send('update-url-bar', url);
    });


    windows.push(newWindow);

    newWindow.on('closed', () => {
        windows = windows.filter(win => win !== newWindow);
    });

    return newWindow;
}

app.whenReady().then(() => {
        createWindow();
        app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    }
);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('new-window', () => {
    createWindow();
});