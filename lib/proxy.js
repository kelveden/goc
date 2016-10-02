const request = require('request');
const R = require('ramda');
const noConfirmation = (callback) => callback();

module.exports = (options, config) => {
    const dryRun = options.parent.dryRun;
    const debug = options.parent.debug;
    const withConfirmation = options.allowUnsafe ?
        R.curry((_, callback) => callback()) :
        require('./confirmer').withConfirmation;

    const sendRequest = (method, confirm) =>
        function (url, opts) {
            return new Promise((resolve, reject) => {
                const responseHandler = (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (res.statusCode >= 300) {
                        reject(res.statusCode + ": " + res.statusMessage + "\n" + res.body);
                        return;
                    }

                    resolve(res);
                };

                url = "https://" + config.host + "/go/api" + url;
                opts.auth = {
                    user: config.user,
                    pass: config.password
                };

                if (dryRun || debug) {
                    console.log(method.toUpperCase() + ": " + url);
                    console.log(opts);
                }

                if (!dryRun) {
                    confirm(
                        () => request[ method ].call(this, url, opts, responseHandler)
                    );
                } else {
                    resolve();
                }
            });
        };

    return {
        "get": sendRequest("get", noConfirmation),
        "delete": sendRequest("del", withConfirmation("You are about to delete something. Are you sure you wish to continue?")),
        "post": sendRequest("post", withConfirmation("You are about to post something. Are you sure you wish to continue?")),
        "put": sendRequest("put", withConfirmation("You are about to put something. Are you sure you wish to continue?"))
    };
};