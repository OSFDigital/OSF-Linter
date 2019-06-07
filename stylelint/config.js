let stylelintConfig = {
    extends: "stylelint-config-standard",
    plugins: ["stylelint-scss"],
    rules: {
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "include",
                    "for",
                    "each",
                    "mixin",
                    "if",
                    "else",
                    "content",
                    "return",
                    "warn",
                    "error",
                    "function"
                ]
            }
        ],
        indentation: 4,
        "scss/at-import-no-partial-leading-underscore": true,
        "no-descending-specificity": null,
        "scss/dollar-variable-no-missing-interpolation": true,
        "scss/media-feature-value-dollar-variable": "always",
        "scss/selector-no-redundant-nesting-selector": true,
        "at-rule-empty-line-before": [
            "always",
            {
                ignoreAtRules: ["else"],
                ignore: ["blockless-after-same-name-blockless", "inside-block"]
            }
        ],
        "block-closing-brace-newline-after": ["always", { ignoreAtRules: ["if", "else"] }],
        "string-quotes" : ["double", { "avoidEscape" : false }]
    }
};

const chalk = require("chalk");
const merge = require("deepmerge");
const fse = require("fs-extra");
const path = require("path");
const process = require("process");

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

if (osfLinterConfig.scssConfig) {
    stylelintConfig = merge(stylelintConfig, osfLinterConfig.scssConfig);
}

module.exports = stylelintConfig;
