module.exports = async report => {
    const _ = require("lodash");
    const chalk = require("chalk");
    const fse = require("fs-extra");
    const path = require("path");
    const process = require("process");
    const stylelint = require("stylelint");
    const uuid4 = require("uuid/v4");

    try {
        const { getPaths } = require("../util");
        const config = require("../config/.stylelintrc");
        const files = getPaths("SCSS");
        const formatter = stylelint.formatters.verbose;
        const data = await stylelint.lint({ config, files, formatter });

        if (data.errored) {
            console.error(data.output);

            if (report) {
                const reportPath = path.resolve(process.cwd(), report);
                if (!fse.existsSync(reportPath)) {
                    fse.ensureDirSync(reportPath);
                }

                const reportFile = path.resolve(reportPath, `StyleLint.${uuid4()}.json`);
                if (fse.existsSync(reportFile)) {
                    console.error(`${chalk.red.bold("\u2716")} reportFile=${reportFile} already exists!`);
                    process.exit(1);
                }

                fse.writeFileSync(
                    reportFile,
                    JSON.stringify(
                        _.flatMap(data.results, result => {
                            const relativePath = path
                                .relative(process.cwd(), result.source)
                                .split(path.sep)
                                .join("/");

                            return _.map(result.warnings, warning => {
                                let startLine = 0;
                                let endLine = 0;

                                if (warning.line) {
                                    startLine = warning.line;
                                    endLine = warning.line;
                                }

                                return {
                                    path: relativePath,
                                    start_line: startLine,
                                    end_line: endLine,
                                    annotation_level: "failure",
                                    message: `[${warning.severity}] ${warning.text}`
                                };
                            });
                        })
                    )
                );
            }

            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run styleint!`);
        console.error(e);
        process.exit(1);
    }
};
