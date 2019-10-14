module.exports = async report => {
    const _ = require("lodash");
    const chalk = require("chalk");
    const eslint = require("eslint");
    const fse = require("fs-extra");
    const globby = require("globby");
    const path = require("path");
    const process = require("process");
    const uuid4 = require("uuid/v4");

    try {
        const { getPaths, getESLintConfig } = require("../util");
        const baseConfig = getESLintConfig();
        const files = await globby(getPaths("JS"));

        const useEslintrc = false;
        const cli = new eslint.CLIEngine({ baseConfig, useEslintrc });
        const data = cli.executeOnFiles(files);

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

                                let startLine = 0;
                                let endLine = 0;

                                if (message.line) {
                                    startLine = message.line;
                                    endLine = message.line;
                                }

                                if (message.endLine && message.endLine > startLine) {
                                    endLine = message.endLine;
                                }

                                return {
                                    path: relativePath,
                                    start_line: startLine,
                                    end_line: endLine,
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
        console.error(`${chalk.red.bold("\u2716")} Failed to run eslint!`);
        console.error(e);
        process.exit(1);
    }
};
