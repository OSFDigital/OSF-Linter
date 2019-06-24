module.exports = async () => {
    const chalk = require("chalk");
    const globby = require("globby");
    const ismllinter = require("isml-linter");
    const merge = require("deepmerge");
    const process = require("process");

    try {
        const defaultConfig = require("../config/.ismllintrc");
        const configWithFix = merge(defaultConfig, { autoFix: true });
        ismllinter.setConfig(configWithFix);

        const { getPaths } = require("../util");
        const files = await globby(getPaths("ISML"));
        const data = ismllinter.parse(files);

        if (data.issueQty > 0 || data.warningCount > 0) {
            ismllinter.printResults();
            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run ismllint!`);
        console.error(e);
        process.exit(1);
    }
};
