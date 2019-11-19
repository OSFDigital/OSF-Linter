const chalk = require("chalk");
const process = require("process");
const stylelint = require("stylelint");

module.exports = async () => {
    try {
        const { getPaths, getStyleLintConfig } = require("../util");
        const config = getStyleLintConfig();
        const files = getPaths("SCSS");

        const formatter = stylelint.formatters.verbose;
        const fix = true;
        const data = await stylelint.lint({ config, files, formatter, fix });

        if (data.errored) {
            console.error(data.output);
            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run styleint!`);
        console.error(e);
        process.exit(1);
    }
};
