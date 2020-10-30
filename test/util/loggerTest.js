const logger = require('../../src/util/logger.js');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('logger: When logger is enabled', function() {
    it('Should write log', function() {
        process.env.LOGGER_ENABLED = true;
        const consoleStub = sinon.stub(console, "log");
        logger.log("message");
        expect(consoleStub.calledOnceWithExactly("message")).to.be.true;
        consoleStub.restore();
    });
});

describe('logger: When logger is disabled', function() {
    it('Should not write log', function() {
        process.env.LOGGER_ENABLED = false;
        const consoleStub = sinon.stub(console, "log");
        logger.log("message");
        expect(consoleStub.callCount).to.be.equal(0);
    })
});