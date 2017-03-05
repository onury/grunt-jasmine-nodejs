(function () {
    'use strict';

    describe('Helpers Test', function () {

        it('should check types', function () {
            expect(1).toBeNumber(1);
            expect('s').toBeString();
            expect(new Date()).toBeDate();
            expect([]).toBeArray();
            expect([]).toBeObject();
            expect({}).toBePlainObject();
        });

        it('should check negative/positive', function () {
            expect(1).toBePositive();
            expect(0).toBePositive();
            expect(-1).toBeNegative();
        });

    });

})();
