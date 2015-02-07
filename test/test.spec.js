/*jslint node:true, nomen:true, unparam:true, plusplus:true, vars:true */
/*global jasmine, describe, fdescribe, xdescribe, before, beforeEach, beforeAll, after, afterEach, afterAll, it, fit, xit, expect, mostRecentAjaxRequest, qq, runs, spyOn, spyOnEvent, waitsFor, confirm, context */

(function () {
    'use strict';

    function Calculator() {}
    var proto = Calculator.prototype;
    proto.add = function add(a, b) { return a + b; };
    proto.subtract = function subtract(a, b) { return a - b; };
    proto.divide = function divide(a, b) { return a / b; };
    proto.multiply = function multiply(a, b) { return a * b; };

    describe('Test Suite: Calculator', function () {
        var calculator,
            a = 10,
            b = 2;

        beforeAll(function () {
            calculator = new Calculator();
        });

        describe('Test Suite: Calculator', function () {
            it('should add numbers', function () {
                var result = calculator.add(a, b);
                expect(result).toEqual(12);
            });
            it('should subtract numbers', function () {
                var result = calculator.subtract(b, a);
                expect(result).toEqual(-8);
            });
            it('should divide numbers', function () {
                var result = calculator.divide(a, b);
                expect(result).toEqual(5);
            });
            it('should multiply numbers', function () {
                var result = calculator.multiply(a, b);
                expect(result).toEqual(20);
            });
        });

    });

}());