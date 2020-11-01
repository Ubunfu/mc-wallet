async function log(message) {
    if (process.env.LOGGER_ENABLED == 'true') {
        console.log(message);
    }
}

exports.log = log;