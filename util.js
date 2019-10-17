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

module.exports.getESLintConfig = () => {
    const chalk = require("chalk");
    const fse = require("fs-extra");
    const path = require("path");
    const process = require("process");

    let esLintRCPath = path.resolve(process.cwd(), ".eslintrc.js");
    if (fse.existsSync(esLintRCPath)) {
        try {
            return require(esLintRCPath);
        } catch (e) {
            console.error(`${chalk.red.bold("\u2716")} Failed to import ${esLintRCPath}!`);
            console.error(e);
            process.exit(1);
        }
    }

    return require("./config/.eslintrc.js");
};

module.exports.getStyleLintConfig = () => {
    const chalk = require("chalk");
    const fse = require("fs-extra");
    const path = require("path");
    const process = require("process");

    let styleLintRCPath = path.resolve(process.cwd(), ".stylelintrc.js");
    if (fse.existsSync(styleLintRCPath)) {
        try {
            return require(styleLintRCPath);
        } catch (e) {
            console.error(`${chalk.red.bold("\u2716")} Failed to import ${styleLintRCPath}!`);
            console.error(e);
            process.exit(1);
        }
    }

    return require("./config/.stylelintrc.js");
};

module.exports.getISMLLintConfig = () => {
    const chalk = require("chalk");
    const fse = require("fs-extra");
    const path = require("path");
    const process = require("process");

    let ismlLintRCPath = path.resolve(process.cwd(), ".ismllintrc.js");
    if (fse.existsSync(ismlLintRCPath)) {
        try {
            return require(ismlLintRCPath);
        } catch (e) {
            console.error(`${chalk.red.bold("\u2716")} Failed to import ${ismlLintRCPath}!`);
            console.error(e);
            process.exit(1);
        }
    }

    return require("./config/.ismllintrc.js");
};
