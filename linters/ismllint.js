module.exports = async report => {
    const _ = require("lodash");
    const chalk = require("chalk");
    const fse = require("fs-extra");
    const globby = require("globby");
    const ismllinter = require("isml-linter");
    const path = require("path");
    const process = require("process");
    const uuid4 = require("uuid/v4");

    try {
        const config = require("../config/.ismllintrc");
        ismllinter.setConfig(config);

        const { getPaths } = require("../util");
        const files = await globby(getPaths("ISML"));
        const data = ismllinter.parse(files);

        if (data.issueQty > 0 || data.warningCount > 0) {
            ismllinter.printResults();

            if (report) {
                let reportPath = path.resolve(process.cwd(), report);
                if (!fse.existsSync(reportPath)) {
                    fse.ensureDirSync(reportPath);
                }

                let reportFile = path.resolve(reportPath, `ISMLLint.${uuid4()}.json`);
                if (fse.existsSync(reportFile)) {
                    console.error(`${chalk.red.bold("\u2716")} reportFile=${reportFile} already exists!`);
                    process.exit(1);
                }

                fse.writeFileSync(
                    reportFile,
                    JSON.stringify(
                        _.flatMap(data.errors, result => {
                            for (let path in result) {
                                if (result.hasOwnProperty(path)) {
                                    return result[path].map(error => ({
                                        path: path,
                                        start_line: error.lineNumber,
                                        end_line: error.lineNumber,
                                        annotation_level: "failure",
                                        message: `[error] ${error.message} (${error.ruleId})`
                                    }));
                                }
                            }
                        })
                    )
                );
            }

            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run ismllint!`);
        console.error(e);
        process.exit(1);
    }
};
