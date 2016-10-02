const inquirer = require('inquirer');
const R = require('ramda');

require('colors');

exports.withConfirmation = R.curry((message, callback) => {
    return inquirer.prompt({ type: "confirm", name: "confirmed", message: message }).then(
        (answers) => {
            if (answers.confirmed) {
                callback();
            } else {
                console.error("Cancelled.".red);
            }
        });
});