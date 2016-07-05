#!/usr/bin/env node

const program = require('commander');
const Printer = require('./printer');
require('colors');

module.exports = function (program) {
    program
        .command('pipelines')
        .description("List all pipelines")
        .action((options) => {
            const printer = new Printer(options);
            const proxy   = require('./proxy')(options);

            proxy.get("/dashboard", {
                auth: {
                },
                headers: {
                    accept: "application/vnd.go.cd.v1+json"
                },
                strictSSL: false
            })
                .then((data) => {
                    const body = JSON.parse(data.body);
                    body._embedded.pipeline_groups.forEach((pipelineGroup) => {
                        console.log(pipelineGroup.name.cyan);
                        pipelineGroup._embedded.pipelines.forEach((pipeline) => {
                            var stages = [];

                            pipeline._embedded.instances[0]._embedded.stages.forEach((stage) => {
                                stages.push(stage.name[stage.status === "Passed" ? "green" : "red"]);
                            });

                            console.log("- " + pipeline.name + " [" + stages.join(", ") + "]");
                        });
                    });
                })
                .catch(printer.printError);
        });
};
