const _ = require("lodash");
const chalk = require("chalk");
const config = require("./config");
const ismllinter = require("isml-linter");
const fse = require("fs-extra");
const globby = require("globby");
const path = require("path");
const process = require("process");
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

    if (!osfLinterConf.ismlLinter) {
        console.error(`${chalk.red.bold("\u2716")} Missing isml linter configuration from ${osfLinterPath}!`);
        process.exit(1);
    }

    try {
        ismllinter.setConfig(config);
        let files = await globby(osfLinterConf.ismlLinter);
        let data = ismllinter.parse(files);

        if (data.issueQty > 0 || data.warningCount > 0) {
            ismllinter.printResults();

            if (report) {
                let reportPath = path.resolve(process.cwd(), report);
                if (!fse.existsSync(reportPath)) {
                    fse.ensureDirSync(reportPath);
                }

                let reportFile = path.resolve(reportPath, `IsmlLinter.${uuid4()}.json`);
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
                                    const errorArray = result[path];

                                    return errorArray.map( error => ({
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
        console.error(`${chalk.red.bold("\u2716")} Failed to run isml linter!`);
        console.error(e);
        process.exit(1);
    }
};
