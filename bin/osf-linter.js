#!/usr/bin/env node

const yargs = require("yargs");
const argv = yargs
    .usage("Usage: $0 [options]")
    .describe("l", "Linter type (JS|SCSS|ISML)")
    .describe("r", "Report path")
    .demandOption(["l"])
    .alias("l", "linter")
    .alias("r", "report")
    .alias("v", "version")
    .alias("h", "help")
    .help("h").argv;

switch (argv.l) {
    case "JS":
        const lintWithESLint = require("../linters/eslint");
        lintWithESLint(argv.r);
        break;

    case "SCSS":
        const lintWithStyleLint = require("../linters/stylelint");
        lintWithStyleLint(argv.r);
        break;

    case "ISML":
        const lintWithISMLLint = require("../linters/ismllint");
        lintWithISMLLint(argv.r);
        break;

    default:
        const chalk = require("chalk");
        console.error(`${chalk.red.bold("\u2716")} Invalid value for linter type!`);

        const process = require("process");
        process.exit(1);
}
