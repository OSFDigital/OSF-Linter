const chalk = require("chalk");
const fse = require("fs-extra");
const path = require("path");
const process = require("process");
const stylelint = require("stylelint");
const uuid4 = require("uuid/v4");
const _flatMap = require("lodash/flatMap");
const _map = require("lodash/map");
const _replace = require("lodash/replace");

function getAnnotations(annotationsData, annotationsPrefix) {
    return _flatMap(annotationsData, result => {
        let relativePath = path
            .relative(process.cwd(), result.source)
            .split(path.sep)
            .join("/");

        if (annotationsPrefix) {
            relativePath = `${annotationsPrefix}${relativePath}`;
        }

        return _map(result.warnings, warning => {
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
                message: warning.text
            };
        });
    });
}

module.exports = async ({ annotationsType, annotationsPath, annotationsPrefix }) => {
    try {
        const { getPaths, getStyleLintConfig } = require("../util");
        const config = getStyleLintConfig();
        const files = getPaths("SCSS");

        const formatter = stylelint.formatters.verbose;
        const data = await stylelint.lint({ config, files, formatter });

        if (data.errored) {
            if (annotationsType === "GITHUB_ACTIONS") {
                console.log("::remove-matcher owner=eslint-compact::");
                console.log("::remove-matcher owner=eslint-stylish::");
                console.log();
            }

            console.error(data.output);

            if (annotationsType === "GITHUB_ACTIONS") {
                const annotations = getAnnotations(data.results, annotationsPrefix);
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

                const annotationnsFile = path.resolve(annotationnsDir, `StyleLint.${uuid4()}.json`);
                if (fse.existsSync(annotationnsFile)) {
                    console.error(`${chalk.red.bold("\u2716")} annotationnsFile=${annotationnsFile} already exists!`);
                    process.exit(1);
                }

                const annotations = getAnnotations(data.results, annotationsPrefix);
                fse.writeFileSync(annotationnsFile, JSON.stringify(annotations));
            }

            process.exit(1);
        }
    } catch (e) {
        console.error(`${chalk.red.bold("\u2716")} Failed to run styleint!`);
        console.error(e);
        process.exit(1);
    }
};
