#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const cli = require('commander')
    .version(require("../package.json").version)
    .option("-f, --format <format>", "The output format (raw, json or yaml)", /^(raw|json|yaml)$/i)
    .option("--ugly", "Turn off prettification")
    .option("--debug", "Print out diagnostics")
    .option("--dryRun", "Print out diagnostics AND don't actually make any requests");
const config = JSON.parse(fs.readFileSync(os.homedir() + "/.goc/config", 'utf8'));

const registerCommands = (cli, dir) =>
    fs.readdirSync(dir)
        .forEach((file) => {
            const filePath = path.join(dir, file);

            if (file.slice(0, 4) === "goc-") {
                require(filePath.toString()).command(cli, config);
            }
        });

registerCommands(cli, __dirname);
cli.command("help", "Display this help", { isDefault: true })
    .action(cli.help);
cli.parse(process.argv);
