beforeEach(function () {
    'use strict';

    jasmine.addMatchers({
        toBeNegative: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: actual < 0
                    };
                }
            };
        },
        toBePositive: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: actual >= 0
                    };
                }
            };
        }
    });

});
