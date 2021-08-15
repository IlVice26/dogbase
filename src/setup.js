const fs = require('fs');
const nodeConsole = require('console');
const jsonFile = require('jsonfile');

var appConfigFilePath = 'src/config/app.json';

module.exports = {
    loadAppConfigFile: function() {
        try { 
            if (fs.existsSync(appConfigFilePath)) {
                return this.checkAppConfigFile(jsonFile.readFileSync(appConfigFilePath));
            }
        } catch (err) {
            console.log(err);
        }
    },
    checkAppConfigFile: function(appConfig) {

        let isChanged = false;

        // Check if language is none (First installation of DogBase)
        if (appConfig['language'] == null) {
            appConfig['language'] = "it_IT";
            isChanged = true;
        }

        // Write to file only if the environment is not undefined (so in production)
        if (isChanged && process.env.NODE_ENV !== undefined) {
            jsonFile.writeFileSync(appConfigFilePath, appConfig, {spaces: 4});
        }

        return appConfig
    },
    setAppLanguage: function() {
        // TODO Change language depending on app.json file
    },
    getTerminal: function() {
        return nodeConsole.Console(process.stdout, process.stderr);
    }
}
