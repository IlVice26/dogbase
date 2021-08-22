const fs = require('fs');
const https = require('https');
const jsonFile = require('jsonfile');
const nodeConsole = require('console');

const {dialog} = require('electron');

var appConfigFilePath = 'resources/config/app.json';
var appConfigFileUrl = 'https://raw.githubusercontent.com/IlVice26/dogbase/master/resources/setup/app.json';

/**
 * Load and check the config app.json file
 * 
 * @returns app.json file
 */
function loadAppConfigFile() {
    // TODO Check if there is a new version of the configuration file on the GitHub repository
    if (!fs.existsSync(appConfigFilePath)) {
        downloadAppConfigFile();
    }
    return checkAppConfigFile(jsonFile.readFileSync(appConfigFilePath));
};

/**
 * Check the configuration file
 * 
 * @param {object} appConfig 
 * @returns appConfig checked
 */
function checkAppConfigFile(appConfig) {

    var isChanged = false;

    // Check if language is none (First installation of DogBase)
    getTerminal().log("[Check-Config] Checking the language set for the application");
    if (appConfig['language'] == null) {
        getTerminal().log("[Check-Config] No language set, setting Italian as default.")
        appConfig['language'] = "it_IT";
        isChanged = true;
    }
    getTerminal().log("[Check-Config] Language set for application: " + appConfig['language']);

    // Check if the Excel database path is present on the config app.json file
    if (appConfig['database']['original_path'] == "" && appConfig['database']['backup_path'] == "") {
        getTerminal().log("[Check-Config] No database founded on app config!");
        dialog.showErrorBox("Attenzione!", "Nessun database impostato!\nSiete pregati di selezionare il database!");
        // isChanged = true;
    }

    // Write to file only if the file has been changed.
    if (isChanged) {
        saveAppConfigFile(appConfig);
    }

    return appConfig
};

/**
 * Save any appConfig changes to the app.json file
 * 
 * @param {object} appConfig 
 */
function saveAppConfigFile(appConfig) {
    getTerminal().log("[Save-ConfigApp] Saving app config file");
    jsonFile.writeFileSync(appConfigFilePath, appConfig, {spaces: 4});
    getTerminal().log("[Save-ConfigApp] Saving Complete");
}

/**
 * Download the default configuration file directly from the repo on GitHub
 */
function downloadAppConfigFile() {
    // TODO Understanding why after downloading and saving the file the application crashes
    var file = fs.createWriteStream(appConfigFilePath);
    https.get(appConfigFileUrl, function(response) {
        response.pipe(file);
        file.on('end', function() {
            file.close(cb);
        })
    })
};

/**
 * Check if the selected database is correct and if so save the path to the
 * app.json file of the original and the backup database
 * 
 * @param {string} databasePath 
 */
function saveDatabasePath(databasePath) {

}

/**
 * Returns the nodejs console
 * 
 * @returns nodeConsole.Console
 */
function getTerminal() {
    return nodeConsole.Console(process.stdout, process.stderr);
};

module.exports = {
    loadAppConfigFile,
    getTerminal
}
