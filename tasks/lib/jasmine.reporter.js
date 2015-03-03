/*jslint node:true, devel:false, nomen:true, regexp:true, unparam:true, vars:true, plusplus:true */

/**
 *  Jasmine.Reporter (based on default reporter)
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @version  0.6.2 (2015-03-01)
 */
module.exports = (function () {
    'use strict';

    //----------------------------
    //  UTILITY METHODS
    //----------------------------

    function plural(str, count) {
        return count === 1 ? str : str + 's';
    }

    function repeat(thing, times) {
        var i, arr = [];
        for (i = 0; i < times; i++) {
            arr.push(thing);
        }
        return arr;
    }

    function indent(str, spaces) {
        var i,
            newArr = [],
            lines = (str || '').split('\n');
        for (i = 0; i < lines.length; i++) {
            newArr.push(repeat(' ', spaces).join('') + lines[i]);
        }
        return newArr.join('\n');
    }

    function filterStack(stack) {
        if (!stack) { return stack; }
        var jasmineCorePath = '/node_modules/jasmine-core';
        var filteredStack = stack.split('\n')
            .filter(function (stackLine) {
                return stackLine.indexOf(jasmineCorePath) === -1;
            })
            .join('\n');
        return filteredStack;
    }

    //----------------------------
    //  CLASS: Timer
    //----------------------------

    function Timer() {
        var startTime = 0,
            endTime = 0;
        this.start = function () {
            startTime = Date.now();
        };
        this.stop = function () {
            endTime = Date.now();
        };
        this.elapsed = function () {
            this.stop();
            var t = (endTime - startTime) / 1000;
            return t.toFixed(3);
        };
    }

    //----------------------------
    //  CLASS: JasmineReporter
    //----------------------------

    function JasmineReporter(options) {
        var print = options.print,
            showColors = options.showColors || false,
            verboseReport = options.verboseReport || false,
            onComplete = options.onComplete || function () {},
            timer = new Timer(), // options.timer || new Timer(),
            suiteCount,
            specCount,
            failureCount,
            failedSpecs = [],
            pendingSpecs = [],
            failedSuites = [],
            failedExpects = [],
            passedExpects = [];

        //----------------------------
        //  HELPER METHODS
        //----------------------------

        function fnStyle(open) {
            var close = '\x1B[0m';
            return function (str) {
                return showColors ? (open + str + close) : str;
            };
        }
        // ansi styles
        var green = fnStyle('\x1B[32m'),
            red = fnStyle('\x1B[31m'),
            yellow = fnStyle('\x1B[33m'),
            // blue = fnStyle('\x1B[34m'),
            cyan = fnStyle('\x1B[36m'),
            underline = fnStyle('\x1B[4m');

        function printNewline() {
            print('\n');
        }

        function specFailureDetails(result, failedSpecNumber) {
            printNewline();
            print(red(failedSpecNumber + ') '));
            print(cyan(result.fullName));
            var i, failedExpectation;
            for (i = 0; i < result.failedExpectations.length; i++) {
                failedExpectation = result.failedExpectations[i];
                printNewline();
                print(indent('Message:', 2));
                printNewline();
                print(red(indent(failedExpectation.message, 4)));
                printNewline();
                print(indent('Stack:', 2));
                printNewline();
                print(indent(filterStack(failedExpectation.stack), 4));
            }
            printNewline();
        }

        function suiteFailureDetails(result) {
            var i;
            for (i = 0; i < result.failedExpectations.length; i++) {
                printNewline();
                print(red('An error was thrown in an afterAll'));
                printNewline();
                print(red('AfterAll ' + result.failedExpectations[i].message));
                console.log(result.failedExpectations[i]);
            }
            printNewline();
        }

        function pendingSpecDetails(result, pendingSpecNumber) {
            printNewline();
            printNewline();
            print(yellow(pendingSpecNumber + ') '));
            print(cyan(result.fullName));

            var pendingReason = ''; // 'No reason given';
            if (result.pendingReason && result.pendingReason !== '') {
                pendingReason = result.pendingReason;
                printNewline();
                print(indent(yellow('Reason: ' + pendingReason), 4));
                // printNewline();
            }
        }

        var suiteList = {};
        function current() {
            if (!suiteList[suiteCount]) {
                suiteList[suiteCount] = { specs: [] };
            }
            return suiteList[suiteCount];
        }

        function fullReport() {
            if (!verboseReport || !suiteList) { return; }
            printNewline();
            print(cyan(underline('Test Suites')) + cyan(':'));
            printNewline();

            var s, c;
            Object.keys(suiteList).forEach(function (i, sIndex) {
                c = sIndex + 1;
                s = suiteList[i];
                printNewline();
                print(indent(cyan(c + ') ' + s.suite.description), 0));
                printNewline();
                printNewline();
                s.specs.forEach(function (spec, index) {
                    switch (spec.status) {
                    case 'pending':
                        print(indent(yellow('• ' + spec.description), 2));
                        break;
                    case 'failed':
                        print(indent(red('✕ ' + spec.description), 2));
                        break;
                    case 'passed':
                        print(indent(green('✓ ' + spec.description), 2));
                        break;
                    }
                    printNewline();
                });
            });
            printNewline();
        }

        //----------------------------
        //  CLASS METHODS
        //----------------------------

        this.jasmineStarted = function () {
            suiteCount = 0;
            specCount = 0;
            failureCount = 0;
            print('Executing specs...');
            printNewline();
            printNewline();
            timer.start();
        };

        this.jasmineDone = function () {
            printNewline();

            fullReport();

            if (failedSpecs.length > 0) {
                printNewline();
                print(red(underline('Failed Specs')) + red(':'));
                printNewline();
            }
            var i;
            for (i = 0; i < failedSpecs.length; i++) {
                specFailureDetails(failedSpecs[i], i + 1);
            }

            if (verboseReport) {
                if (pendingSpecs.length > 0) {
                    printNewline();
                    print(yellow(underline('Pending Specs')) + yellow(':'));
                }
                for (i = 0; i < pendingSpecs.length; i++) {
                    pendingSpecDetails(pendingSpecs[i], i + 1);
                }
            }

            if (specCount > 0) {
                printNewline();
                printNewline();

                var assertCount = passedExpects.length + failedExpects.length,
                    f = failedExpects.length + ' ' + plural('failure', failedExpects.length);
                f = failedExpects.length > 0 ? red(f) : f;

                var counts = suiteCount + ' ' + plural('suite', suiteCount) + ', ' +
                    specCount + ' ' + plural('spec', specCount) + ', ' +
                    assertCount + ' ' + plural('assert', assertCount) + ', ' +
                    // failureCount + ' ' + plural('failure', failureCount);
                    // failedExpects.length + ' ' + plural('failure', failedExpects.length);
                    f;

                if (pendingSpecs.length) {
                    counts += ', ' + yellow(pendingSpecs.length + ' pending ' + plural('spec', pendingSpecs.length));
                }

                print(counts);
            } else {
                print('No specs found.');
            }

            printNewline();
            var seconds = timer.elapsed(); // / 1000;
            print('Finished in ' + seconds + ' ' + plural('second', seconds));
            printNewline();
            printNewline();

            for (i = 0; i < failedSuites.length; i++) {
                suiteFailureDetails(failedSuites[i]);
            }

            onComplete(failureCount === 0);
        };

        this.specDone = function (result) {
            if (verboseReport) {
                // for fullReport
                current().specs.push(result);
            }

            failedExpects = failedExpects.concat(result.failedExpectations);
            passedExpects = passedExpects.concat(result.passedExpectations);
            // console.log(passedExpects);
            specCount++;

            if (result.status === 'pending') {
                pendingSpecs.push(result);
                print(yellow('•'));
                return;
            }

            if (result.status === 'passed') {
                print(green('∙')); // '✓'
                return;
            }

            if (result.status === 'failed') {
                failureCount++;
                failedSpecs.push(result);
                print(red(' ✕ '));
            }
        };

        this.suiteDone = function (result) {
            if (verboseReport) {
                // for fullReport
                current().suite = result;
            }

            suiteCount++;
            if (result.failedExpectations && result.failedExpectations.length > 0) {
                failureCount++;
                failedSuites.push(result);
            }
        };

    }

    //----------------------------
    //  EXPORT
    //----------------------------

    return JasmineReporter;

}());