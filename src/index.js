const { log } = require('./util/logger.js');
const paymentService = require('./service/paymentService.js');

exports.handler = async (event, context) => {
    await log('Received event: ' + JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.requestContext.http.path == '/pay') {
        const player = JSON.parse(event.body).player;
        const amount = JSON.parse(event.body).amount;
        try {
            paymentService.pay(player, amount);
        } catch (err) {
            statusCode = '500';
            body = {
                error: 'payment failed',
                errorDetail: err.message
            }
        }
    } else if (event.requestContext.http.path == '/charge') {
        const player = JSON.parse(event.body).player;
        const amount = JSON.parse(event.body).amount;
        try {
            paymentService.charge(player, amount);
        } catch (err) {
            if (err.message == 'wallet not found') {
                statusCode = '404';
            } else {
                statusCode = '500';
            }
            body = {
                error: 'charge failed',
                errorDetail: err.message
            }
        }
    } else {
        statusCode = '404'
    }

    body = JSON.stringify(body);
    return {
        statusCode,
        body,
        headers,
    };
};