#!/usr/bin/env node

const process = require("process");
const yargs = require("yargs");
const chalk = require("chalk");
const eslintServer = require("../eslint_server/linter");
const eslintClient = require("../eslint_client/linter");
const stylelint = require("../stylelint/linter");
const ismlLinter = require("../isml_linter/linter");

const argv = yargs
    .usage("Usage: $0 [options]")
    .describe("l", "Linter type (eslintServer|eslintClient|stylelint|ismllinter)")
    .describe("r", "Report path")
    .demandOption(["l"])
    .alias("l", "linter")
    .alias("r", "report")
    .alias("v", "version")
    .alias("h", "help")
    .help("h")
    .argv;

switch (argv.l) {
    case "eslintServer":
        eslintServer(argv.r);
        break;

    case "eslintClient":
        eslintClient(argv.r);
        break;

    case "stylelint":
        stylelint(argv.r);
        break;
    
    case "ismllinter":
        ismlLinter(argv.r);
        break;

    default:
        console.error(`${chalk.red.bold("\u2716")} Invalid value for linter type!`);
        process.exit(1);
}
