module.exports.getPaths = name => {
    const chalk = require("chalk");
    const fse = require("fs-extra");
    const path = require("path");
    const process = require("process");

    let osfLinterPathsPath = path.resolve(process.cwd(), "osflinter.paths.js");
    if (!fse.existsSync(osfLinterPathsPath)) {
        console.error(`${chalk.red.bold("\u2716")} ${osfLinterPathsPath} does not exist!`);
        process.exit(1);
    }

    let osfLinterPathsObj;
    try {
        osfLinterPathsObj = require(osfLinterPathsPath);
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterPathsPath}!`);
        console.error(e);
        process.exit(1);
    }

    if (!osfLinterPathsObj) {
        console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterPathsPath}!`);
        process.exit(1);
    }

    if (!osfLinterPathsObj[name]) {
        console.error(`${chalk.red.bold("\u2716")} Missing scssPaths configuration from ${osfLinterPathsPath}!`);
        process.exit(1);
    }

    return osfLinterPathsObj[name];
};

module.exports.getConfig = (name, defaultConfig) => {
    const chalk = require("chalk");
    const fse = require("fs-extra");
    const merge = require("deepmerge");
    const path = require("path");
    const process = require("process");

    let osfLinterConfigPath = path.resolve(process.cwd(), "osflinter.config.js");
    if (fse.existsSync(osfLinterConfigPath)) {
        let osfLinterConfigObj;
        try {
            osfLinterConfigObj = require(osfLinterConfigPath);
        } catch (e) {
            console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterConfigPath}!`);
            console.error(e);
            process.exit(1);
        }

        if (!osfLinterConfigObj) {
            console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterConfigPath}!`);
            process.exit(1);
        }

        if (osfLinterConfigObj[name]) {
            return merge(defaultConfig, osfLinterConfigObj[name]);
        }
    }

    return defaultConfig;
};
