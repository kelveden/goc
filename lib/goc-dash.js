#!/usr/bin/env node

const Printer = require('./printer');
require('colors');

const action = ( config ) => ( options ) => {
    const printer = new Printer(options);
    const proxy = require('./proxy')(options, config);

    return proxy.get("/dashboard", { headers: { accept: "application/vnd.go.cd.v1+json" }, strictSSL: false })
        .then(printer.printResponse(( body ) => {
            body._embedded.pipeline_groups.forEach(( pipelineGroup ) => {
                console.log(pipelineGroup.name.cyan);
                pipelineGroup._embedded.pipelines.forEach(( pipeline ) => {
                    var stages = [];

                    pipeline._embedded.instances[ 0 ]._embedded.stages.forEach(( stage ) => {
                        var colour = "grey";

                        if (stage.status === "Passed") {
                            colour = "green";
                        } else if (stage.status.endsWith("ing")) {
                            colour = "yellow";
                        } else if (stage.status.endsWith("ed")) {
                            colour = "red";
                        }
                        stages.push(stage.name[ colour ]);
                    });

                    console.log("- " + pipeline.name + " [" + stages.join(", ") + "] (" + pipeline._embedded.instances[ 0 ].schedule_at + ")");
                });
            });
        }))
        .catch(( err ) => console.error(err));
};

const command = ( program, config ) => {
    program
        .command('dash')
        .description("List all pipelines and stage status.")
        .action(action(config));
};

exports.action = action;
exports.command = command;