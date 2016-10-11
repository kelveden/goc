#!/usr/bin/env node

const gun = require('./gun');
const open = require('open');

const action = ( config ) => ( pipeline, options ) => {
    const proxy = require('./proxy')(options, config);
    const pipelineId = gun.examine(pipeline)

    open("https://" + config.host + "/go/tab/pipeline/history/" + pipelineId)
};

const command = ( program, config ) => {
    program
        .command('open <pipeline>')
        .description("Opens the pipeline for inspection.")
        .action(action(config));
};

exports.action = action;
exports.command = command;