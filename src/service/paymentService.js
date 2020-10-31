const dbService = require('../service/dbService.js');

async function pay(player, amount) {
    
    let walletResp;
    try {
        walletResp = await dbService.getWallet(player);
    } catch (err) {
        throw Error('error retrieving wallet');
    }
    
    if(walletResp.WalletId == undefined) {
        try {
            await dbService.createWallet(player);
        } catch (err) {
            throw Error('error creating wallet');
        }
    }

    try {
        await dbService.updateWallet(player, amount);
    } catch (err) {
        throw Error('error updating wallet');
    }
}

async function charge(player, amount) {

    let walletResp;
    try {
        walletResp = await dbService.getWallet(player);
    } catch (err) {
        throw Error('error retrieving wallet');
    }
    
    if(walletResp.WalletId == undefined) {
        throw Error('wallet does not exist');
    }

    if (walletResp.Balance < amount) {
        throw Error('insufficient funds');
    }

    try {
        await dbService.updateWallet(player, -amount);
    } catch (err) {
        throw Error('error updating wallet');
    }
}

exports.pay = pay;
exports.charge = charge;