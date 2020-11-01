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
        throw Error('db_error');
    }
}

async function updateWallet() {

}

async function createWallet(docClient, player) {
    const params = {
        TableName: process.env.TABLE_WALLETS,
        Item:{
            "WalletId": player,
            "Balance": 0
        }
    };
    try {
        await docClient.put(params).promise();
    } catch (err) {
        throw Error('db_error');
    }
}

exports.getWallet = getWallet;
exports.updateWallet = updateWallet;
exports.createWallet = createWallet;