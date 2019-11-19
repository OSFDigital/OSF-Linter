#!/usr/bin/env node

const chalk = require("chalk");
const process = require("process");

const yargs = require("yargs");
const argv = yargs
    .usage("Usage: $0 [options]")
    .option("l", {
        alias: "linter",
        demandOption: true,
        describe: "Linter type",
        choices: ["JS", "SCSS", "ISML"]
    })
    .option("annotations-type", {
        describe: "Annotations type",
        default: "NONE",
        choices: ["NONE", "FILE", "GITHUB_ACTIONS"]
    })
    .option("annotations-path", {
        describe: "Annotations path"
    })
    .option("annotations-prefix", {
        describe: "Annotations prefix"
    })
    .check(argv => {
        if (argv.annotationsType === "FILE" && !argv.annotationsPath) {
            throw new Error(
                `${chalk.red.bold("\u2716")} Missing dependent arguments: annotations-type -> annotations-path`
            );
        }

        if (argv.annotationsPath && argv.annotationsType !== "FILE") {
            throw new Error(
                `${chalk.red.bold("\u2716")} Missing dependent arguments: annotations-path -> annotations-type=FILE`
            );
        }

        if (argv.annotationsPrefix && !argv.annotationsType) {
            throw new Error(
                `${chalk.red.bold("\u2716")} Missing dependent arguments: annotations-prefix -> annotations-type`
            );
        }

        return true;
    })
    .alias("h", "help")
    .alias("v", "version")
    .help("h").argv;

switch (argv.l) {
    case "JS":
        const lintWithESLint = require("../linters/eslint");
        lintWithESLint(argv);
        break;

    case "SCSS":
        const lintWithStyleLint = require("../linters/stylelint");
        lintWithStyleLint(argv);
        break;

    case "ISML":
        const lintWithISMLLint = require("../linters/ismllint");
        lintWithISMLLint(argv);
        break;

    default:
        console.error(`${chalk.red.bold("\u2716")} Invalid value for linter type!`);
        process.exit(1);
}
