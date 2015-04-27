/*jslint node:true, nomen:true, unparam:true, plusplus:true, vars:true */
/*global jasmine, describe, fdescribe, xdescribe, before, beforeEach, beforeAll, after, afterEach, afterAll, it, fit, xit, expect, pending, mostRecentAjaxRequest, qq, runs, spyOn, spyOnEvent, waitsFor, confirm, context */

(function () {
    'use strict';

    describe('Activity Test', function () {

        // if jasmine is not configured otherwise, this will timeout if more
        // than 5 seconds.
        it('should log ticks', function (done) {
            var ticks = 0,
                maxTicks = 10,
                modLog = 4;
            var timer = setInterval(function () {
                if (ticks >= maxTicks) {
                    clearInterval(timer);
                    timer = null;
                    done();
                    return;
                }
                if (ticks % modLog === 0) {
                    console.log('Log @ ' + ticks + '...');
                }
                ticks++;
            }, 400);
        });

    });

}());