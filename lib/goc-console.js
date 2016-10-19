#!/usr/bin/env node

const Printer = require('./printer');
const moment = require('moment');
const gun = require('./gun');
require('colors');

const action = ( config ) => ( pipeline, stage, options ) => {
    const printer = new Printer(options);
    const proxy = require('./proxy')(options, config);
    const pipelineId = gun.examine(pipeline)

    return proxy.get("/api/pipelines/" + pipelineId + "/history", { strictSSL: false })
        .then((resp) => {
            const pipelines = JSON.parse(resp.body).pipelines;
            const label = pipelines[0].label;

            return proxy.get("/files/" + pipelineId + "/" + label + "/" + stage + "/1/" + stage.toLowerCase() + "/cruise-output/console.log", { strictSSL: false })
        })
        .then(({ body }) => {
            console.log(body);
        })
        .catch(( err ) => console.error(err));
};

const command = ( program, config ) => {
    program
        .command('console <pipeline> <stage>')
        .description("Gets the console for the specified stage in the pipeline.")
        .action(action(config));
};

exports.action = action;
exports.command = command;