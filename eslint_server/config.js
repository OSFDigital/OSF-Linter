let eslintServerConfig = {
    root: true,
    extends: "eslint:recommended",
    env: {
        commonjs: true
    },
    globals: {
        dw: true,
        customer: true,
        session: true,
        request: true,
        response: true,
        empty: true,
        PIPELET_ERROR: true,
        PIPELET_NEXT: true
    },
    rules: {
        "eol-last": ["error", "always"],
        "func-style": "off",
        "global-require": "off",
        "linebreak-style": ["error", "unix"],
        "keyword-spacing": ["error", { before: true, after: true }],
        "no-bitwise": "off",
        "no-plusplus": "off",
        "no-unneeded-ternary": "off",
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "prefer-const": "off",
        "prefer-spread": "off",
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        radix: ["error", "always"],
        semi: ["error", "always"],
        strict: ["error", "global"]
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

if (osfLinterConfig.JS_SERVER_CONFIG) {
    eslintServerConfig = merge(eslintServerConfig, osfLinterConfig.JS_SERVER_CONFIG);
}

module.exports = eslintServerConfig;
