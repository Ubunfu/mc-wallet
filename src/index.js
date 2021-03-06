require('dotenv').config();
const { log } = require('./util/logger.js');
const paymentService = require('./service/paymentService.js');
const dbService = require('./service/dbService.js');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const errorMessageEnum = require('./enums/errorMessageEnum.js');
const paymentServiceErrorEnum = require('./enums/paymentServiceErrorEnum.js');

exports.handler = async (event, context) => {
    logEvent(event);

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.requestContext.routeKey == 'POST /pay') {
        const player = JSON.parse(event.body).player;
        const amount = JSON.parse(event.body).amount;
        try {
            await paymentService.pay(player, amount);
        } catch (err) {
            if (err.message == paymentServiceErrorEnum.ERROR_NON_POSITIVE_AMOUNT) {
                statusCode = '400';
            } else {
                statusCode = '500';
            }
            body = {
                error: errorMessageEnum.ERROR_PAY_WALLET_FAILED,
                errorDetail: err.message
            }
        }
    } else if (event.requestContext.routeKey == 'POST /charge') {
        const player = JSON.parse(event.body).player;
        const amount = JSON.parse(event.body).amount;
        try {
            await paymentService.charge(player, amount);
        } catch (err) {
            if (err.message == paymentServiceErrorEnum.ERROR_WALLET_NOT_FOUND) {
                statusCode = '404';
            } else if (err.message == paymentServiceErrorEnum.ERROR_NON_POSITIVE_AMOUNT) {
                statusCode = '400';
            } else {
                statusCode = '500';
            }
            body = {
                error: errorMessageEnum.ERROR_CHARGE_WALLET_FAILED,
                errorDetail: err.message
            }
        }
    } else if (event.requestContext.routeKey == 'GET /wallet') {
        const walletId = event.queryStringParameters.id;
        try {
            const walletResp = await dbService.getWallet(docClient, walletId);
            if (walletResp.WalletId == undefined) {
                statusCode = '404';
                body = {
                    error: errorMessageEnum.ERROR_GET_WALLET_FAILED,
                    errorDetail: paymentServiceErrorEnum.ERROR_WALLET_NOT_FOUND
                }
            } else {
                body = walletResp;
            }
        } catch (err) {
            statusCode = '500';
            body = {
                error: errorMessageEnum.ERROR_GET_WALLET_FAILED,
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

async function logEvent(event) {
    if (event.headers) {
        event.headers.host = "XXX";
    }
    if (event.requestContext) {
        event.requestContext.domainName = "XXX";
    }
    await log(JSON.stringify(event, null, 2));
}