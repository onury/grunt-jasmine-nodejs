(function () {
    'use strict';

    describe('before/after Test', function () {

        var foo, bar;

        beforeEach(function () {
            foo += 1;
            bar += 1;
        });

        beforeAll(function () {
            expect(foo).toBeUndefined();
            expect(bar).toBeUndefined();
            foo = 0;
            bar = 1;
            console.log();
            console.log('beforeAll');
            console.log('foo =', foo);
            console.log('bar =', bar);
        });

        afterEach(function () {
            expect(foo).toBeGreaterThan(0);
            expect(bar).toBeGreaterThan(1);
            foo = 0;
        });

        afterAll(function () {
            // this should still execute even though we throw in some specs.
            expect(foo).toEqual(0);
            expect(bar).toEqual(6);
            console.log();
            console.log('afterAll');
            console.log('foo =', foo);
            console.log('bar =', bar);
        });

        it('should check foo', function () {
            expect(foo).toEqual(1);
            expect(foo).toBeNumber();
        });

        it('should check bar', function () {
            expect(bar).toBeGreaterThan(1);
        });

        it('should throw 1', function () {
            expect(1).toEqual(2); // throw
        });

        function _throw() {
            throw new Error('Test Error (this is expected)');
        }

        it('should throw 2', function () {
            expect(_throw).toThrow();
            _throw();
        });

        it('should check all', function () {
            expect(foo).toEqual(1);
            expect(bar).toBeGreaterThan(1);
        });

    });

})();
