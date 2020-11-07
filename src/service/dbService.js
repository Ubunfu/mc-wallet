const { log } = require("../util/logger");

async function getWallet(docClient, player) {
    const params = {
        TableName: process.env.TABLE_WALLETS,
        Key: {
            "WalletId": player
        }
    };
    try {
        log('Query params: ' + JSON.stringify(params));
        const theWallet = await docClient.get(params).promise();
        log('DB Returned: ' + JSON.stringify(theWallet));
        if (theWallet.Item == undefined) {
            return {};
        }
        return theWallet.Item;
    } catch (err) {
        log(err);
        throw Error('db_error');
    }
}

async function updateWallet(docClient, player, amount) {
    const params = {
        TableName: process.env.TABLE_WALLETS,
        Key:{
            "WalletId": player
        },
        UpdateExpression: "set Balance = Balance + :val",
        ExpressionAttributeValues: {
            ":val": amount
        },
        ReturnValues: "UPDATED_NEW"
    };
    try {
        log('Query params: ' + JSON.stringify(params));
        await docClient.update(params).promise();
    } catch (err) {
        log(err);
        throw Error('db_error');
    }

}

async function createWallet(docClient, player) {
    const params = {
        TableName: process.env.TABLE_WALLETS,
        Item: {
            "WalletId": player,
            "Balance": 0
        }
    };
    try {
        log('Query params: ' + JSON.stringify(params));
        await docClient.put(params).promise();
    } catch (err) {
        log(err);
        throw Error('db_error');
    }
}

exports.getWallet = getWallet;
exports.updateWallet = updateWallet;
exports.createWallet = createWallet;