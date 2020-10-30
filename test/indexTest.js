describe('index: When receives wallet payment request', function() {
    describe('And wallet exists', function() {
        it('Should add requested amount to the wallet');
    });
    describe('And wallet does not exist', function() {
        it('Should create the wallet');
        it('Should add requested amount to the wallet');
    });
});

describe('index: When receives wallet charge request', function() {
   describe('And wallet exists', function() {
       describe('And wallet contains sufficient funds', function() {
           it('Should subtract requested amount from the wallet');
        });
        describe('And wallet contains insufficient funds', function() {
            it('Should return HTTP 500');
            it('Should return error code');
        });
   });
   describe('And wallet does not exist', function() {
        it('Should return HTTP 404');
   });
});
