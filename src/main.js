const electron = require('electron');
const url = require('url');
const path = require('path');
const { nativeTheme } = require('electron');

const setup = require('./setup');


const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', function(){

    nativeTheme.themeSource = 'light';

    // Creating a new window
    mainWindow = new BrowserWindow({});
    setup.loadAppConfigFile(mainWindow);

    // Loading the initial html page
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'html/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    // Closing the main window will close all the windows of the app
    mainWindow.on('closed', function() {
        app.quit();
    });

    // Building the menu bar
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

function openSelectionFileWindow() {

    electron.dialog.showOpenDialog({
        title: 'Seleziona il database creato in Excel',
        properties: ['openFile'],
        filters: [
            {name: 'Excel Database', extensions: ['txt']}
        ]
    }).then(result => {
        var filePath = result.filePaths;
        console.log(filePath);
    }).catch(err => {
        console.error(err);
    });

}

// Creazione del template della barra del menu
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Aggiungi Database',
                click() { 
                    openSelectionFileWindow();
                }
            },
            {
                label: 'Esci',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: 'Reload App',
                role: 'reload'
            }
        ]
    })
}