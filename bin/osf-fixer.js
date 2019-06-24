#!/usr/bin/env node

const yargs = require("yargs");
const argv = yargs
    .usage("Usage: $0 [options]")
    .describe("f", "Fixer type (JS|SCSS|ISML)")
    .demandOption(["f"])
    .alias("f", "fixer")
    .alias("v", "version")
    .alias("h", "help")
    .help("h")
    .argv;

switch (argv.f) {
    case "JS":
        const fixWithESLint = require("../fixers/eslint");
        fixWithESLint(argv.r);
        break;

    case "SCSS":
        const fixWithStyleLint = require("../fixers/stylelint");
        fixWithStyleLint(argv.r);
        break;

    case "ISML":
        const fixWithISMLLint = require("../fixers/ismllint");
        fixWithISMLLint(argv.r);
        break;

    default:
        const chalk = require("chalk");
        console.error(`${chalk.red.bold("\u2716")} Invalid value for fixer type!`);

        const process = require("process");
        process.exit(1);
}
