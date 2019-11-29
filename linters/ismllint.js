const chalk = require("chalk");
const fse = require("fs-extra");
const globby = require("globby");
const ismllinter = require("isml-linter");
const path = require("path");
const process = require("process");
const uuid4 = require("uuid/v4");
const _flatMap = require("lodash/flatMap");
const _replace = require("lodash/replace");

function getAnnotations(annotationsData, annotationsPrefix) {
    return _flatMap(annotationsData, result => {
        for (let source in result) {
            if (result.hasOwnProperty(source)) {
                return result[source].map(error => {
                    let relativePath = path
                        .relative(process.cwd(), source)
                        .split(path.sep)
                        .join("/");

                    if (annotationsPrefix) {
                        relativePath = `${annotationsPrefix}${relativePath}`;
                    }

                    return {
                        path: relativePath,
                        start_line: error.lineNumber,
                        end_line: error.lineNumber,
                        annotation_level: "failure",
                        message: `${error.message} (${error.ruleId})`
                    };
                });
            }
        }
    });
}

module.exports = async ({ annotationsType, annotationsPath, annotationsPrefix }) => {
    try {
        const { getPaths, getISMLLintConfig } = require("../util");
        const config = getISMLLintConfig();
        const files = await globby(getPaths("ISML"));

        ismllinter.setConfig(config);
        const data = ismllinter.parse(files);

        if (data.issueQty > 0 || data.warningCount > 0) {
            if (annotationsType === "GITHUB_ACTIONS") {
                console.log("::remove-matcher owner=eslint-compact::");
                console.log("::remove-matcher owner=eslint-stylish::");
                console.log();
            }

            ismllinter.printResults();

            if (annotationsType === "GITHUB_ACTIONS") {
                const annotations = getAnnotations(data.errors, annotationsPrefix);
                annotations.forEach(annotation => {
                    const annotationFile = annotation.path;
                    const annotationLine = annotation.start_line;
                    const annotationMessage = _replace(_replace(annotation.message, /\r/g, "%0D"), /\n/g, "%0A");
                    console.error(`::error file=${annotationFile},line=${annotationLine}::${annotationMessage}`);
                });
                console.error();
            }

            if (annotationsType === "FILE") {
                const annotationnsDir = path.resolve(process.cwd(), annotationsPath);
                if (!fse.existsSync(annotationnsDir)) {
                    fse.ensureDirSync(annotationnsDir);
                }

                const annotationnsFile = path.resolve(annotationnsDir, `ISMLLint.${uuid4()}.json`);
                if (fse.existsSync(annotationnsFile)) {
                    console.error(`${chalk.red.bold("\u2716")} annotationnsFile=${annotationnsFile} already exists!`);
                    process.exit(1);
                }

                const annotations = getAnnotations(data.errors, annotationsPrefix);
                fse.writeFileSync(annotationnsFile, JSON.stringify(annotations));
            }

            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run ismllint!`);
        console.error(e);
        process.exit(1);
    }
};
