const chalk = require("chalk");
const eslint = require("eslint");
const fse = require("fs-extra");
const globby = require("globby");
const path = require("path");
const process = require("process");
const uuid4 = require("uuid/v4");
const _flatMap = require("lodash/flatMap");
const _map = require("lodash/map");
const _replace = require("lodash/replace");

function getAnnotations(annotationsData, annotationsPrefix) {
    return _flatMap(annotationsData, result => {
        let relativePath = path
            .relative(process.cwd(), result.filePath)
            .split(path.sep)
            .join("/");

        if (annotationsPrefix) {
            relativePath = `${annotationsPrefix}${relativePath}`;
        }

        return _map(result.messages, message => {
            let startLine = 0;
            let endLine = 0;

            if (message.line) {
                startLine = message.line;
                endLine = message.line;
            }

            if (message.endLine && message.endLine > startLine) {
                endLine = message.endLine;
            }

            let messageText = message.message;
            if (message.ruleId) {
                messageText = `${messageText} (${message.ruleId})`;
            }

            return {
                path: relativePath,
                start_line: startLine,
                end_line: endLine,
                annotation_level: "failure",
                message: messageText
            };
        });
    });
}

module.exports = async ({ annotationsType, annotationsPath, annotationsPrefix }) => {
    try {
        const { getPaths, getESLintConfig } = require("../util");
        const baseConfig = getESLintConfig();
        const files = await globby(getPaths("JS"));

        const useEslintrc = false;
        const cli = new eslint.CLIEngine({ baseConfig, useEslintrc });
        const data = cli.executeOnFiles(files);

        if (data.errorCount > 0 || data.warningCount > 0) {
            const formatter = cli.getFormatter("stylish");

            if (annotationsType === "GITHUB_ACTIONS") {
                console.log("::remove-matcher owner=eslint-compact::");
                console.log("::remove-matcher owner=eslint-stylish::");
                console.log();
            }

            console.error(formatter(data.results));

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

                const annotationnsFile = path.resolve(annotationnsDir, `ESLintClient.${uuid4()}.json`);
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
        console.error(`${chalk.red.bold("\u2716")} Failed to run eslint!`);
        console.error(e);
        process.exit(1);
    }
};
