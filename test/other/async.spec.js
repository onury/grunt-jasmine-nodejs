(function () {
    'use strict';

    xdescribe('Async Test', function () {

        it('should catch async errors', function (done) {
            setTimeout(function () {
                throw new Error('Async error!');
            }, 100);
        });

    });

})();
