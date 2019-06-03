#!/usr/bin/env node

const process = require("process");
const yargs = require("yargs");
const chalk = require("chalk");
const eslintServer = require("../eslint_server/linter");
const eslintClient = require("../eslint_client/linter");
const stylelint = require("../stylelint/linter");
const ismllint = require("../ismllint/linter");

const argv = yargs
    .usage("Usage: $0 [options]")
    .describe("l", "Linter type (JS:SERVER|JS:CLIENT|SCSS|ISML)")
    .describe("r", "Report path")
    .demandOption(["l"])
    .alias("l", "linter")
    .alias("r", "report")
    .alias("v", "version")
    .alias("h", "help")
    .help("h")
    .argv;

switch (argv.l) {
    case "JS:SERVER":
        eslintServer(argv.r);
        break;

    case "JS:CLIENT":
        eslintClient(argv.r);
        break;

    case "SCSS":
        stylelint(argv.r);
        break;

    case "ISML":
        ismllint(argv.r);
        break;

    default:
        console.error(`${chalk.red.bold("\u2716")} Invalid value for linter type!`);
        process.exit(1);
}
