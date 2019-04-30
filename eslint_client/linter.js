const _ = require("lodash");
const chalk = require("chalk");
const config = require("./config");
const eslint = require("eslint");
const fse = require("fs-extra");
const globby = require("globby");
const path = require("path");
const process = require("process");
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

    if (!osfLinterConfig.eslintClientPaths) {
        console.error(`${chalk.red.bold("\u2716")} Missing eslintClientPaths configuration from ${osfLinterConfigPath}!`);
        process.exit(1);
    }

    try {
        let cli = new eslint.CLIEngine({baseConfig: config});
        let files = await globby(osfLinterConfig.eslintClientPaths);
        let data = cli.executeOnFiles(files);

        if (data.errorCount > 0 || data.warningCount > 0) {
            let formatter = cli.getFormatter("stylish");
            console.error(formatter(data.results));

            if (report) {
                let reportPath = path.resolve(process.cwd(), report);
                if (!fse.existsSync(reportPath)) {
                    fse.ensureDirSync(reportPath);
                }

                let reportFile = path.resolve(reportPath, `ESLintClient.${uuid4()}.json`);
                if (fse.existsSync(reportFile)) {
                    console.error(`${chalk.red.bold("\u2716")} reportFile=${reportFile} already exists!`);
                    process.exit(1);
                }

                fse.writeFileSync(
                    reportFile,
                    JSON.stringify(
                        _.flatMap(data.results, result => {
                            let relativePath = path
                                .relative(process.cwd(), result.filePath)
                                .split(path.sep)
                                .join("/");

                            return _.map(result.messages, message => {
                                let messageType = "warning";
                                if (message.fatal || message.severity === 2) {
                                    messageType = "error";
                                }

                                return {
                                    path: relativePath,
                                    start_line: message.line,
                                    end_line: message.endLine,
                                    annotation_level: "failure",
                                    message: `[${messageType}] ${message.message} (${message.ruleId})`
                                };
                            });
                        })
                    )
                );
            }

            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run eslintClient!`);
        console.error(e);
        process.exit(1);
    }
};
