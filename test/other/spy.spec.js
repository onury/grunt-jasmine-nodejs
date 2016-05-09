(function () {
    'use strict';

    describe('Spy Test', function () {

        it('error on empty spy list', function () {
            jasmine.createSpyObj('spy object', []);
        });

        it('error on missing spy list', function () {
            jasmine.createSpyObj('spy object');
        });
    });

})();
