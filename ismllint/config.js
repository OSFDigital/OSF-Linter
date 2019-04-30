let ismllintConfig = {

};

const fse = require("fs-extra");
const path = require("path");
const process = require("process");

let osfLinterConfigPath = path.resolve(process.cwd(), "osflinter.config.js");
if (!fse.existsSync(osfLinterConfigPath)) {
    console.error(`${chalk.red.bold("\u2716")} ${osfLinterConfigPath} does not exist!`);
    process.exit(1);
}

let osfLinterConfig;
try {
    osfLinterConfig = require(osfLinterConfigPath);
} catch (e) {
    console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterConfigPath}!`);
    console.error(e);
    process.exit(1);
}

if (!osfLinterConfig) {
    console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterConfigPath}!`);
    process.exit(1);
}

if (osfLinterConfig.ismllintConfig) {
    ismllintConfig = { ...ismllintConfig, ...osfLinterConfig.ismllintConfig };
}

module.exports = ismllintConfig;
