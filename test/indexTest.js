const index = require('../src/index.js');
const expect = require('chai').expect;
const sinon = require('sinon');
const paymentService = require('../src/service/paymentService.js');

const EVENT_PAYMENT = {
    requestContext: {
        http: {
            path: '/pay'
        }
    },
    body: '{"player": "player1", "amount": 100}'
}
const EVENT_CHARGE = {
    requestContext: {
        http: {
            path: '/charge'
        }
    },
    body: '{"player": "player1", "amount": 100}'
}

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
                .throws('error!');
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
            expect(respBody.errorDetail).to.be.equal('error!');
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
                .throws('wallet not found');
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
                .throws('unexpected error');
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
