const _ = require("lodash");
const config = require("./config");
const chalk = require("chalk");
const fse = require("fs-extra");
const path = require("path");
const process = require("process");
const stylelint = require("stylelint");
const uuid4 = require("uuid/v4");

module.exports = async report => {
    let osfLinterPath = path.resolve(process.cwd(), "osflinter.config.js");
    if (!fse.existsSync(osfLinterPath)) {
        console.error(`${chalk.red.bold("\u2716")} ${osfLinterPath} does not exist!`);
        process.exit(1);
    }

    let osfLinterConf;
    try {
        osfLinterConf = require(osfLinterPath);
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterPath}!`);
        console.error(e);
        process.exit(1);
    }

    if (!osfLinterConf) {
        console.error(`${chalk.red.bold("\u2716")} Failed to import ${osfLinterPath}!`);
        process.exit(1);
    }

    if (!osfLinterConf.stylelint) {
        console.error(`${chalk.red.bold("\u2716")} Missing stylelint configuration from ${osfLinterPath}!`);
        process.exit(1);
    }

    if (!osfLinterConf.stylelint.paths) {
        console.error(`${chalk.red.bold("\u2716")} Missing stylelint.paths configuration from ${osfLinterPath}!`);
        process.exit(1);
    }

    let stylelintPaths = [...osfLinterConf.stylelint.paths];
    let stylelintConfig = {...config};

    if (osfLinterConf.stylelint.config) {
        stylelintConfig = {
            ...config,
            ...osfLinterConf.stylelint.config
        };
    }

    try {
        let data = await stylelint.lint({
            config: stylelintConfig,
            files: stylelintPaths,
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
