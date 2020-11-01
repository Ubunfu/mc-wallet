const { log } = require("../util/logger");

async function getWallet(docClient, player) {
    const params = {
        TableName: process.env.TABLE_WALLETS,
        Key: {
            'WalletId': player
        }
    };
    try {
        const theWallet = await docClient.get(params).promise();
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
        await docClient.put(params).promise();
    } catch (err) {
        log(err);
        throw Error('db_error');
    }
}

exports.getWallet = getWallet;
exports.updateWallet = updateWallet;
exports.createWallet = createWallet;