#!/usr/bin/env node

const chalk = require("chalk");
const process = require("process");

const yargs = require("yargs");
const argv = yargs
    .usage("Usage: $0 [options]")
    .option("f", {
        alias: "fixer",
        demandOption: true,
        describe: "Fixer type",
        choices: ["JS", "SCSS", "ISML"]
    })
    .alias("v", "version")
    .alias("h", "help")
    .help("h").argv;

switch (argv.f) {
    case "JS":
        const fixWithESLint = require("../fixers/eslint");
        fixWithESLint();
        break;

    case "SCSS":
        const fixWithStyleLint = require("../fixers/stylelint");
        fixWithStyleLint();
        break;

    case "ISML":
        const fixWithISMLLint = require("../fixers/ismllint");
        fixWithISMLLint();
        break;

    default:
        console.error(`${chalk.red.bold("\u2716")} Invalid value for fixer type!`);
        process.exit(1);
}
