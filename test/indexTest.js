const index = require('../src/index.js');
const expect = require('chai').expect;
const sinon = require('sinon');
const paymentService = require('../src/service/paymentService.js');
const dbService = require('../src/service/dbService.js');

const ERROR_GET_WALLET_FAILED = 'get wallet failed';
const ERROR_DETAIL_WALLET_DOES_NOT_EXIST = 'wallet does not exist';

const EVENT_PAYMENT = {
    requestContext: {
        routeKey: 'POST /pay'
    },
    body: '{"player": "player1", "amount": 100}'
}
const EVENT_CHARGE = {
    requestContext: {
        routeKey: 'POST /charge'
    },
    body: '{"player": "player1", "amount": 100}'
}
const EVENT_GET_WALLET = {
    requestContext: {
        routeKey: 'GET /wallet'
    },
    queryStringParameters: {
        id: 'player1'
    }
}
const A_WALLET = {
    WalletId: 'player',
    Balance: 100
}

describe('index: When receives a get wallet request', function() {
    describe('And wallet not found', function() {
        it('Returns HTTP 404', async function() {
            const dbServiceMock = sinon.stub(dbService, "getWallet")
                .returns({});
            const walletResp = await index.handler(EVENT_GET_WALLET);
            expect(walletResp.statusCode).to.be.equal('404');
            expect(JSON.parse(walletResp.body).error).to.be.equal(ERROR_GET_WALLET_FAILED);
            expect(JSON.parse(walletResp.body).errorDetail).to.be.equal(ERROR_DETAIL_WALLET_DOES_NOT_EXIST);
            dbServiceMock.restore();
        });
    });
    describe('And some other error happens', function() {
        it('Returns HTTP 500', async function() {
            const dbServiceMock = sinon.stub(dbService, "getWallet")
                .throws('errorName', ERROR_GET_WALLET_FAILED);
            const walletResp = await index.handler(EVENT_GET_WALLET);
            expect(walletResp.statusCode).to.be.equal('500');
            expect(JSON.parse(walletResp.body).error).to.be.equal(ERROR_GET_WALLET_FAILED);
            expect(JSON.parse(walletResp.body).errorDetail).to.be.equal(ERROR_GET_WALLET_FAILED);
            dbServiceMock.restore();
        });
    });
    describe('And DB returns a wallet', function() {
        it('Returns the wallet', async function() {
            const dbServiceMock = sinon.stub(dbService, "getWallet")
                .returns(A_WALLET);
            const walletResp = await index.handler(EVENT_GET_WALLET);
            expect(walletResp.statusCode).to.be.equal('200');
            expect(JSON.parse(walletResp.body)).to.be.deep.equal(A_WALLET);
            dbServiceMock.restore();
        });
    });
});

describe('index: When receives wallet payment request', function() {
    describe('And payment service succeeds', function() {
        let handlerResp, paymentServiceMock = null;
        beforeEach(async function() {
            paymentServiceMock = sinon.stub(paymentService, "pay")
                .returns({});
            handlerResp = await index.handler(EVENT_PAYMENT);
        });
        afterEach(function() {
            paymentServiceMock.restore();
        });
        it('Should call payment service with player and amount', function() {
            expect(paymentServiceMock.calledOnceWith("player1", 100)).to.be.true;
        });
        it('Should return HTTP 200', function() {
            expect(handlerResp.statusCode).to.be.equal('200');
        });
    });
    describe('And payment service fails', function() {
        let handlerResp, paymentServiceMock = null;
        beforeEach(async function() {
            paymentServiceMock = sinon.stub(paymentService, "pay")
                .throws('errorName', 'errorMessage!');
            handlerResp = await index.handler(EVENT_PAYMENT);
        });
        afterEach(function() {
            paymentServiceMock.restore();
        });
        it('Should return HTTP 500', function() {
            expect(handlerResp.statusCode).to.be.equal('500');
        });
        it('Should return error code', function() {
            const respBody = JSON.parse(handlerResp.body);
            expect(respBody.error).to.be.equal('payment failed');
            expect(respBody.errorDetail).to.be.equal('errorMessage!');
        });
    });
});

describe('index: When receives wallet charge request', function() {
    describe('And payment service succeeds', function() {
        let handlerResp, paymentServiceMock = null;
        beforeEach(async function() {
            paymentServiceMock = sinon.stub(paymentService, "charge")
                .returns({});
            handlerResp = await index.handler(EVENT_CHARGE);
        });
        afterEach(function() {
            paymentServiceMock.restore();
        });
        it('Should call payment service with player and amount', function() {
            expect(paymentServiceMock.calledOnceWith("player1", 100));
        });
        it('Should return HTTP 200', function() {
            expect(handlerResp.statusCode).to.be.equal('200');
        });
    });
    describe('And payment service fails because wallet missing', function() {
        let handlerResp, paymentServiceMock = null;
        beforeEach(async function() {
            paymentServiceMock = sinon.stub(paymentService, "charge")
                .throws('errorName', 'wallet not found');
            handlerResp = await index.handler(EVENT_CHARGE);
        });
        afterEach(function() {
            paymentServiceMock.restore();
        });
        it('Should return HTTP 404', function() {
            expect(handlerResp.statusCode).to.be.equal('404');
        });
        it('Should return error code', function() {
            const respBody = JSON.parse(handlerResp.body);
            expect(respBody.error).to.be.equal('charge failed');
            expect(respBody.errorDetail).to.be.equal('wallet not found');
        });
    });
    describe('And payment service fails otherwise', function() {
        let handlerResp, paymentServiceMock = null;
        beforeEach(async function() {
            paymentServiceMock = sinon.stub(paymentService, "charge")
                .throws('errorName', 'unexpected error');
            handlerResp = await index.handler(EVENT_CHARGE);
        });
        afterEach(function() {
            paymentServiceMock.restore();
        });
        it('Should return HTTP 500', function() {
            expect(handlerResp.statusCode).to.be.equal('500');
        });
        it('Should return error code', function() {
            const respBody = JSON.parse(handlerResp.body);
            expect(respBody.error).to.be.equal('charge failed');
            expect(respBody.errorDetail).to.be.equal('unexpected error');
        });
    });
});

describe('index: Receives unknown request', function() {
    
    it('Should return HTTP 404', async function() {
        const handlerResp = await index.handler({
            requestContext: {
                http: {
                    path: '/notfound'
                }
            }
        });
        expect(handlerResp.statusCode).to.be.equal('404');
    });
})
