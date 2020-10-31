const paymentService = require('../../src/service/paymentService.js');
const sinon = require('sinon');
const expect = require('chai').expect;
const dbService = require('../../src/service/dbService.js');

const A_WALLET = {
    WalletId: "player",
    Balance: 0
};

const A_WALLET_BALANCE_100 = {
    WalletId: "player",
    Balance: 100
};

const ERROR_UPDATE_WALLET_FAILED = 'error updating wallet';
const ERROR_CREATE_WALLET_FAILED = 'error creating wallet';
const ERROR_INSUFFICIENT_FUNDS = 'insufficient funds';
const ERROR_WALLET_NOT_FOUND = 'wallet does not exist';

describe('paymentService: When paying a player', function() {
    describe('And wallet exists', function() {
        let getWalletMock = null;
        beforeEach(function() {
            getWalletMock = sinon.stub(dbService, "getWallet")
                .returns(A_WALLET);
        });
        afterEach(function() {
            getWalletMock.restore();
        });

        describe('And update wallet succeeds', function() {
            it('Should update wallet correctly', async function() {
                const updateWalletMock = sinon.stub(dbService, "updateWallet")
                    .returns({});
                const paymentServiceResp = await paymentService.pay("player", 10);
                expect(updateWalletMock.calledOnceWith("player", 10)).to.be.true;
                updateWalletMock.restore();
            });
        });
        describe('And update wallet fails', function() {
            it('Should return error', async function() {
                const updateWalletMock = sinon.stub(dbService, "updateWallet")
                    .throws('error');
                try {
                    await paymentService.pay("player", 10);
                    expect(true).to.be.false;
                } catch (err) {
                    expect(err.message).to.be.equal(ERROR_UPDATE_WALLET_FAILED);
                }
                updateWalletMock.restore();
            });
        });

    });
    describe('And wallet does not exist', function() {
        let getWalletMock, updateWalletMock = null;
        beforeEach(function() {
            getWalletMock = sinon.stub(dbService, "getWallet")
                .returns({});
            updateWalletMock = sinon.stub(dbService, "updateWallet")
                .returns({});
        });
        afterEach(function() {
            getWalletMock.restore();
            updateWalletMock.restore();
        });
        describe('And create wallet succeeds', function() {
            let createWalletMock = null;
            beforeEach(async function() {
                createWalletMock = sinon.stub(dbService, "createWallet")
                    .returns({});
                await paymentService.pay("player", 10);
            });
            afterEach(function() {
                createWalletMock.restore();
            });
            it('Should create the wallet', function() {
                expect(createWalletMock.calledOnceWith("player")).to.be.true;
            });
            it('Should update wallet correctly', function() {
                expect(updateWalletMock.calledOnceWith("player", 10)).to.be.true;
            });
        });
        describe('And create wallet fails', function() {
            let createWalletMock = null;
            beforeEach(function() {
                createWalletMock = sinon.stub(dbService, "createWallet")
                    .throws('some error');
            });
            afterEach(function() {
                createWalletMock.restore();
            });
            it('Should throw an error', async function() {
                try {
                    await paymentService.pay("player", 10);
                    expect(true).to.be.false;
                } catch (err) {
                    expect(err.message).to.be.equal(ERROR_CREATE_WALLET_FAILED);
                }
            });
        });
    });
});

describe('paymentService: When charging a player', function() {
    describe('And wallet exists', function() {
        describe('And player has sufficient funds', function() {
            let getWalletMock;
            beforeEach(function() {
                getWalletMock = sinon.stub(dbService, "getWallet")
                    .returns(A_WALLET_BALANCE_100);
            });
            afterEach(function() {
                getWalletMock.restore();
            });
            describe('And update wallet succeeds', function() {
                it('Should update wallet correctly', async function() {
                    const updateWalletMock = sinon.stub(dbService, "updateWallet")
                        .returns({});
                    await paymentService.charge("player", 10);
                    expect(updateWalletMock.calledOnceWith("player", -10)).to.be.true;
                    updateWalletMock.restore();
                });
            });
            describe('And update wallet fails', function() {
                it('Should throw an error', async function() {
                    const updateWalletMock = sinon.stub(dbService, "updateWallet")
                        .throws('some error');
                    try {
                        await paymentService.charge("player", 10);
                        expect(true).to.be.false;
                    } catch (err) {
                        expect(err.message).to.be.equal(ERROR_UPDATE_WALLET_FAILED);
                    }
                    updateWalletMock.restore();
                });
            });
        });
        describe('And player has insufficient funds', function() {
            it('Should throw an error', async function() {
                const getWalletMock = sinon.stub(dbService, "getWallet")
                    .returns(A_WALLET);
                try {
                    await paymentService.charge("player", 10);
                    expect(true).to.be.false;
                } catch (err) {
                    expect(err.message).to.be.equal(ERROR_INSUFFICIENT_FUNDS);
                }
                getWalletMock.restore();
            });
        });
    });
    describe('And wallet does not exist', function() {
        it('Should throw an error', async function() {
            const getWalletMock = sinon.stub(dbService, "getWallet")
                    .returns({});
                try {
                    await paymentService.charge("player", 10);
                    expect(true).to.be.false;
                } catch (err) {
                    expect(err.message).to.be.equal(ERROR_WALLET_NOT_FOUND);
                }
                getWalletMock.restore();
        });
    });
});