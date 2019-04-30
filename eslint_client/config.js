let eslintClientConfig = {
    root: true,
    useEslintrc: false,
    extends: "eslint:recommended",
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jquery: true
    },
    globals: {},
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

if (osfLinterConfig.eslintClientConfig) {
    eslintClientConfig = { ...eslintClientConfig, ...osfLinterConfig.eslintClientConfig };
}

module.exports = eslintClientConfig;
