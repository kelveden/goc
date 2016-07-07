#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cli = require('commander')
    .version(require("../package.json").version)
    .option("-f, --format <format>", "The output format (raw, json or yaml) - defaults to json", /^(raw|json|yaml)$/i)
    .option("--ugly", "Turn off prettification")
    .option("--debug", "Print out diagnostics")
    .option("--dryRun", "Print out diagnostics AND don't actually make any requests");

const registerCommands = (cli, dir) => {
    fs.readdirSync(dir)
        .forEach((file) => {
            const filePath = path.join(dir, file);

            if (file.slice(0, 4) === "goc-") {
                require(filePath.toString())(cli);
            }
        });
}

registerCommands(cli, __dirname);
cli.command("help", "Display this help", { isDefault: true })
    .action(cli.help);
cli.parse(process.argv);
