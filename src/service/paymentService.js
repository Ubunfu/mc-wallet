const dbService = require('../service/dbService.js');
const AWS = require('aws-sdk');
const { log } = require('../util/logger.js');
const docClient = new AWS.DynamoDB.DocumentClient();
const paymentServiceErrorEnum = require('../enums/paymentServiceErrorEnum.js');

async function pay(player, amount) {

    if (amount <= 0) {
        throw Error(paymentServiceErrorEnum.ERROR_NON_POSITIVE_AMOUNT);
    }
    
    let walletResp;
    try {
        walletResp = await dbService.getWallet(docClient, player);
    } catch (err) {
        log('error retrieving wallet: ' + JSON.stringify(err));
        throw Error(paymentServiceErrorEnum.ERROR_GET_WALLET_FAILED);
    }
    
    if(walletResp.WalletId == undefined) {
        try {
            await dbService.createWallet(docClient, player);
        } catch (err) {
            log('error creating wallet: ' + JSON.stringify(err));
            throw Error(paymentServiceErrorEnum.ERROR_CREATE_WALLET_FAILED);
        }
    }
    
    try {
        await dbService.updateWallet(docClient, player, amount);
    } catch (err) {
        log('error updating wallet: ' + JSON.stringify(err));
        throw Error(paymentServiceErrorEnum.ERROR_UPDATE_WALLET_FAILED);
    }
}

async function charge(player, amount) {
    
    if (amount <= 0) {
        throw Error(paymentServiceErrorEnum.ERROR_NON_POSITIVE_AMOUNT);
    }
    
    let walletResp;
    try {
        walletResp = await dbService.getWallet(docClient, player);
    } catch (err) {
        log('error retrieving wallet: ' + JSON.stringify(err));
        throw Error(paymentServiceErrorEnum.ERROR_GET_WALLET_FAILED);
    }
    
    if(walletResp.WalletId == undefined) {
        throw Error(paymentServiceErrorEnum.ERROR_WALLET_NOT_FOUND);
    }

    if (walletResp.Balance < amount) {
        throw Error(paymentServiceErrorEnum.ERROR_INSUFFICIENT_FUNDS);
    }

    try {
        await dbService.updateWallet(docClient, player, -amount);
    } catch (err) {
        log('error updating wallet: ' + JSON.stringify(err));
        throw Error(paymentServiceErrorEnum.ERROR_UPDATE_WALLET_FAILED);
    }
}

exports.pay = pay;
exports.charge = charge;