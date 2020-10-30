describe('paymentService: When paying a player', function() {
    describe('And wallet exists', function() {
        it('Should add requested amount to the wallet');
    });
    describe('And wallet does not exist', function() {
        it('Should create the wallet');
        it('Should add requested amount to the wallet');
    });
});

describe('paymentService: When charging a player', function() {
    describe('And wallet exists', function() {
        describe('And player has sufficient funds', function() {
            it('Should add requested amount to the wallet');
        });
        describe('And player has insufficient funds', function() {
            it('Should return an error');
        });
    });
    describe('And wallet does not exist', function() {
        it('Should create the wallet');
        it('Should add requested amount to the wallet');
    });
});