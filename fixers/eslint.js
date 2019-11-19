const chalk = require("chalk");
const eslint = require("eslint");
const globby = require("globby");
const process = require("process");

module.exports = async () => {
    try {
        const { getPaths, getESLintConfig } = require("../util");
        const baseConfig = getESLintConfig();
        const files = await globby(getPaths("JS"));

        const useEslintrc = false;
        const fix = true;
        const cli = new eslint.CLIEngine({ baseConfig, useEslintrc, fix });
        const data = cli.executeOnFiles(files);
        eslint.CLIEngine.outputFixes(data);

        if (data.errorCount > 0 || data.warningCount > 0) {
            let formatter = cli.getFormatter("stylish");
            console.error(formatter(data.results));
            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run eslint!`);
        console.error(e);
        process.exit(1);
    }
};
