const sinon = require('sinon');
const dbService = require('../../src/service/dbService.js');
const expect = require('chai').expect;

describe('dbService: When createWallet is called', function() {
    describe('And DynamoDB fails', function() {
        it('throws an error', async function() {
            const docClientMock = {
                put: sinon.stub().returnsThis(),
                promise: sinon.stub().rejects()
            };
            try {
                await dbService.createWallet(docClientMock, "player");
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal('db_error');
            }
        });
    });

    it('Should call dynamoDB', async function() {
        const docClientMock = {
            put: sinon.stub().returnsThis(),
            promise: sinon.stub().resolves({})
        };
        await dbService.createWallet(docClientMock, "player");
        expect(docClientMock.promise.callCount).to.be.equal(1);
    });
});

describe('dbService: When getWallet is called', function() {
    describe('And DynamoDB fails', function() {
        it('Should throw an error', async function() {
            const docClientMock = {
                get: sinon.stub().returnsThis(),
                promise: sinon.stub().rejects()
            };
            try {
                await dbService.getWallet(docClientMock, "player");
                expect(true).to.be.false;
            } catch (err) {
                expect(err.message).to.be.equal('db_error');
            }
        });
    });
    describe('And DynamoDB returns a wallet', function() {
        it('Should return the wallet', async function() {
            const docClientMock = {
                get: sinon.stub().returnsThis(),
                promise: sinon.stub().resolves({
                    Item: {
                        WalletId: 'player',
                        Balance: 100
                    }
                })
            };
            const dbResp = await dbService.getWallet(docClientMock, "player");
            expect(dbResp.WalletId).to.be.equal('player');
        });
    });
});