(function () {
    'use strict';

    describe('Suite 1 (Level 1)', function () {

        it('Suite 1, Spec 1', function () {
            expect(true).toEqual(true);
        });
        it('Suite 1, Spec 2', function () {
            expect(true).toEqual(true);
        });
        xit('Suite 1, Spec 3', function (done) {
            expect(false).toEqual(true);
            done();
            // setTimeout(function () {
            //     expect(1).toEqual(2);
            //     done();
            // }, 1000);
        });

        describe('Suite 2 (Level 2)', function () {
            it('Suite 2, Spec 1 (single)', function () {
                expect(false).toEqual(true);
            });
            xdescribe('Suite 3 (Level 3)', function () {
                it('Suite 3, Spec 1', function () {
                    expect(true).toEqual(true);
                });
                it('Suite 3, Spec 2', function () {
                    expect(false).toEqual(true);
                });
            });
            xit('Suite 2, Spec 2 (final)', function () {
                expect(true).toEqual(true);
            });
        });

        it('Suite 1, Spec 4 (final)', function () {
            expect(true).toEqual(true);
            pending('test pending');
        });

        xdescribe('Suite 4 (Level 2)', function () {
            it('Suite 4, Spec 1 (single)', function () {
                expect(true).toEqual(true);
            });
        });

        describe('Suite 5 (Level 2)', function () {
            it('Suite 5, Spec 1 (single)', function () {
                expect(true).toEqual(true);
            });
        });

    });

    describe('Suite 6 (Level 1)', function () {
        it('Suite 6, Spec 1', function () {
            expect(true).toEqual(true);
        });
        xit('Suite 6, Spec 2 (final)', function () {
            expect(true).toEqual(true);
        });
    });

})();
