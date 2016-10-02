#!/usr/bin/env node

const gun = require('./gun');
const _ = require('lodash');
const R = require('ramda');

const action = ( config ) => ( pipeline, options ) => {
    const proxy = require('./proxy')(options, config);
    const pipelineId = gun.examine(pipeline)

    console.log("Starting " + pipelineId + "...");

    return proxy.post("/pipelines/" + pipelineId + "/schedule", { headers: { Confirm: "true" }, strictSSL: false })
        .then((res) => console.log(res.body))
        .catch(( err ) => console.error(err));
};

const command = ( program, config ) => {
    program
        .command('start <pipeline>')
        .description("Kicks off a build of the specified pipeline.")
        .action(action(config));
};

exports.action = action;
exports.command = command;