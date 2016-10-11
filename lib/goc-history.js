#!/usr/bin/env node

const Printer = require('./printer');
const moment = require('moment');
const gun = require('./gun');
require('colors');

const action = ( config ) => ( pipeline, options ) => {
    const printer = new Printer(options);
    const proxy = require('./proxy')(options, config);
    const pipelineId = gun.examine(pipeline)

    return proxy.get("/pipelines/" + pipelineId + "/history", { strictSSL: false })
        .then(printer.printResponse(( body ) => {
            console.log(pipelineId.cyan);

            body.pipelines.forEach(( pipeline ) => {
                var stages = [];
                pipeline.stages.forEach(( stage ) => {
                    var colour = "■".grey;

                    if (stage.result) {
                        if (stage.result === "Passed") {
                            colour = "■".green;
                        } else if (stage.result.endsWith("ed")) {
                            colour = "■".red;
                        }
                    }

                    stages.push(colour);
                });

                console.log(pipeline.label + " [" + stages.join(" ") + "] (" + moment(pipeline.stages[ 0 ].jobs[ 0 ].scheduled_date).fromNow() + ")");
            });
        }))
        .catch(( err ) => console.error(err));
};

const command = ( program, config ) => {
    program
        .command('history <pipeline>')
        .description("Get the pipeline history.")
        .action(action(config));
};

exports.action = action;
exports.command = command;