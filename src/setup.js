const loadJsonFile = require('load-json-file')

module.exports = {
    loadAppConfigFile: function(window) {
        var configFile = loadJsonFile('src/config/app.json');
    },
    setAppLanguage: function() {
        console.log("Language load");
    }
}
