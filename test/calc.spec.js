/*jslint node:true, nomen:true, unparam:true, plusplus:true, vars:true */
/*global jasmine, describe, fdescribe, xdescribe, before, beforeEach, beforeAll, after, afterEach, afterAll, it, fit, xit, expect, pending, mostRecentAjaxRequest, qq, runs, spyOn, spyOnEvent, waitsFor, confirm, context */

(function () {
    'use strict';

    function Calculator() {}
    var proto = Calculator.prototype;
    proto.add = function add(a, b) { return a + b; };
    proto.subtract = function subtract(a, b) { return a - b; };
    proto.divide = function divide(a, b) { return a / b; };
    proto.multiply = function multiply(a, b) { return a * b; };

    describe('Calculator Suite', function () {
        var calculator,
            a = 10,
            b = 2;

        beforeAll(function () {
            calculator = new Calculator();
        });

        it('should add numbers', function () {
            var result = calculator.add(a, b);
            expect(result).toEqual(12);
            // this is a custom matcher implemented within our helper.
            expect(result).toBePositive();
        });
        it('should execute async spec...', function (done) {
            var result = calculator.add(a, b);
            setTimeout(function () {
                expect(result).toEqual(12);
                done();
            }, 4000);
        });
        it('should subtract numbers', function () {
            var result = calculator.subtract(b, a);
            expect(result).toEqual(-8);
            // this is another custom matcher implemented within our helper.
            expect(result).toBeNegative();
        });
        // it('should divide numbers', function () {
        //     var result = calculator.divide(a, b);
        //     expect(result).toEqual(0); // should be 5 so this will throw
        // });
        it('should multiply numbers (final)', function () {
            var result = calculator.multiply(a, b);
            expect(result).toEqual(20);
            pending('this is the pending reason');
        });

    });

}());