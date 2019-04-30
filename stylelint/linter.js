const _ = require("lodash");
const config = require("./config");
const chalk = require("chalk");
const fse = require("fs-extra");
const path = require("path");
const process = require("process");
const stylelint = require("stylelint");
const uuid4 = require("uuid/v4");

module.exports = async report => {
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

    if (!osfLinterConfig.stylelintPaths) {
        console.error(`${chalk.red.bold("\u2716")} Missing stylelintPaths configuration from ${osfLinterConfigPath}!`);
        process.exit(1);
    }

    try {
        let data = await stylelint.lint({
            config: config,
            files: osfLinterConfig.stylelintPaths,
            formatter: stylelint.formatters.verbose
        });

        if (data.errored) {
            console.error(data.output);

            if (report) {
                let reportPath = path.resolve(process.cwd(), report);
                if (!fse.existsSync(reportPath)) {
                    fse.ensureDirSync(reportPath);
                }

                let reportFile = path.resolve(reportPath, `StyleLint.${uuid4()}.json`);
                if (fse.existsSync(reportFile)) {
                    console.error(`${chalk.red.bold("\u2716")} reportFile=${reportFile} already exists!`);
                    process.exit(1);
                }

                fse.writeFileSync(
                    reportFile,
                    JSON.stringify(
                        _.flatMap(data.results, result => {
                            let relativePath = path
                                .relative(process.cwd(), result.source)
                                .split(path.sep)
                                .join("/");

                            return _.map(result.warnings, warning => {
                                return {
                                    path: relativePath,
                                    start_line: warning.line,
                                    end_line: warning.line,
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
