#!/usr/bin/env node

const program = require('commander');
const Printer = require('./printer');

module.exports = function (program) {
    program
        .command('pipelines')
        .description("List all pipelines")
        .action((options) => {
            const printer = new Printer(options);
            const proxy   = require('./proxy')(options);

            proxy.get("https://bosp-go.ovotech.org.uk:8154/go/api/dashboard", {
                auth: {
                },
                headers: {
                    accept: "application/vnd.go.cd.v1+json"
                },
                strictSSL: false
            })
                .then(printer.printResponse)
                .catch(printer.printError);
        });
};
