#!/usr/bin/env node

const program = require('commander');
const Printer = require('./printer');

module.exports = function (program) {
    program
        .command('pipeline <pipeline>')
        .description("List all pipelines")
        .action((pipeline, options) => {
            const printer = new Printer(options);
            const proxy   = require('./proxy')(options);

            proxy.get("/pipelines/" + pipeline + "/status", {
                strictSSL: false
            })
                .then(printer.printResponse())
                .catch(printer.printError);
        });
};
