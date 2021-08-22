const electron = require('electron');
const url = require('url');
const path = require('path');
const { nativeTheme, dialog } = require('electron');

const util = require('./util');
const database = require('./database');
const { config } = require('process');

const {app, BrowserWindow, Menu} = electron;

var terminal = util.getTerminal();
var configFile = util.loadAppConfigFile();
var mainWindow;

app.on('ready', function(){

    nativeTheme.themeSource = 'light';

    // Creating a new window
    mainWindow = new BrowserWindow({});

    if (configFile['database']['original_path'] == "" && configFile['database']['backup_path'] == "") {
        openSelectionFileWindow()
    }

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

/**
 * Opens a window to the user asking to select the excel database
 */
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
        // database.checkDatabaseIntegrity(filePath[0]);
    }).catch(err => {
        console.error(err);
    });

}

// Creating the menu bar template
// TODO Move the template to util.js with the creation depending on the OS
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Database',
                submenu: [
                    {
                        label: 'Aggiungi database',
                        click() { 
                            openSelectionFileWindow();
                        }
                    },
                    {
                        label: 'Controllo integrità database',
                        click() {
                            database.checkDatabaseIntegrity(file='');
                        }
                    }
                ]
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

/**
 *  // TODO Support for macOS will be developed later
 *  If the application is launched on macOS, instead of 
 *  displaying 'Electron', it displays 'File'
 *  if (process.platform == 'darwin') {
 *      mainMenuTemplate.unshift({});
 *  }
**/

// During the development phase, DevTools are enabled
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform = 'Ctrl+I',
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