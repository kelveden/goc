#!/usr/bin/env node

const program = require('commander');
const Printer = require('./printer');
require('colors');

module.exports = function (program) {
    program
        .command('dash')
        .description("List all pipelines and stage status")
        .action((options) => {
            const printer = new Printer(options);
            const proxy   = require('./proxy')(options);

            proxy.get("/dashboard", {
                auth: {},
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

                            pipeline._embedded.instances[ 0 ]._embedded.stages.forEach((stage) => {
                                var colour = "red";
                                if (stage.status === "Passed") {
                                    colour = "green"
                                } else if (stage.status === "Unknown") {
                                    colour = "grey"
                                } else if (stage.status.endsWith("ing")) {
                                    colour = "yellow"
                                }
                                stages.push(stage.name[ colour ]);
                            });

                            console.log("- " + pipeline.name + " [" + stages.join(", ") + "]");
                        });
                    });
                })
                .catch(printer.printError);
        });
};
