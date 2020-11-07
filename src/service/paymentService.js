const dbService = require('../service/dbService.js');
const AWS = require('aws-sdk');
const { log } = require('../util/logger.js');
const docClient = new AWS.DynamoDB.DocumentClient();

async function pay(player, amount) {
    
    let walletResp;
    try {
        walletResp = await dbService.getWallet(docClient, player);
    } catch (err) {
        log('error retrieving wallet: ' + JSON.stringify(err));
        throw Error('error retrieving wallet');
    }
    
    if(walletResp.WalletId == undefined) {
        try {
            await dbService.createWallet(docClient, player);
        } catch (err) {
            log('error creating wallet: ' + JSON.stringify(err));
            throw Error('error creating wallet');
        }
    }
    
    try {
        await dbService.updateWallet(docClient, player, amount);
    } catch (err) {
        log('error updating wallet: ' + JSON.stringify(err));
        throw Error('error updating wallet');
    }
}

async function charge(player, amount) {
    
    let walletResp;
    try {
        walletResp = await dbService.getWallet(docClient, player);
    } catch (err) {
        log('error retrieving wallet: ' + JSON.stringify(err));
        throw Error('error retrieving wallet');
    }
    
    if(walletResp.WalletId == undefined) {
        throw Error('wallet does not exist');
    }

    if (walletResp.Balance < amount) {
        throw Error('insufficient funds');
    }

    try {
        await dbService.updateWallet(docClient, player, -amount);
    } catch (err) {
        log('error updating wallet: ' + JSON.stringify(err));
        throw Error('error updating wallet');
    }
}

exports.pay = pay;
exports.charge = charge;