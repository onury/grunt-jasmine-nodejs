beforeEach(function () {
    'use strict';

    function type(o) {
        return Object.prototype.toString.call(o).match(/\s(\w+)/i)[1].toLowerCase();
    }

    jasmine.addMatchers({
        toBeString: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: typeof actual === 'string'
                    };
                }
            };
        },
        toBeNumber: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: typeof actual === 'number'
                    };
                }
            };
        },
        toBeFunction: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: typeof actual === 'function'
                    };
                }
            };
        },
        toBeArray: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: Array.isArray(actual)
                    };
                }
            };
        },
        toBeObject: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: typeof actual === 'object'
                    };
                }
            };
        },
        toBePlainObject: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: type(actual) === 'object'
                    };
                }
            };
        },
        toBeDate: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: type(actual) === 'date'
                    };
                }
            };
        }
    });

});
