const electron = require('electron');
const url = require('url');
const path = require('path');
const { nativeTheme, dialog } = require('electron');

const setup = require('./setup.js');


const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', function(){

    nativeTheme.themeSource = 'light';

    // Creating a new window
    mainWindow = new BrowserWindow({});

    terminal = setup.getTerminal();
    configFile = setup.loadAppConfigFile();

    terminal.log("The app.json file has been loaded correctly!");

    // Loading the initial html page
    mainWindow.loadURL(url.format({ // TODO Replace deprecated format function
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
            {name: 'Excel Database', extensions: ['xlsx']}
        ]
    }).then(result => {
        // TODO Being able to open the xlsx file and being able to read and write to it
        var filePath = result.filePaths;
    }).catch(err => {
        console.error(err);
    });

}

// Creating the menu bar template
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

// If the application is launched on macOS, instead of 
// displaying 'Electron', it displays 'File'
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// During the development phase, DevTools are enabled
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