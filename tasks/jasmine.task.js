/*jslint node:true, nomen:true, unparam:true, vars:true, plusplus:true */

/**
 *  Jasmine Grunt Task for NodeJS.
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = function (grunt) {
    'use strict';

    var Jasmine = require('jasmine'),
        ConsoleReporter = require('./lib/console.reporter'),
        reporters = require('jasmine-reporters'),
        path = require('path'),
        _ = grunt.util._;

    //-------------------------------------
    //  UTILITY METHODS
    //-------------------------------------

    function ensureArray(value, delim) {
        return !_.isArray(value)
            ? (value || '').split(delim)
            : value;
    }

    function hasSuffix(suffixes, filePath) {
        return _.some(suffixes, function (suffix) {
            return _.endsWith(filePath.toLowerCase(), suffix.toLowerCase());
        });
    }

    function expand(glob, suffixes) {
        var options = {
            // matchBase: true,
            filter: function (filePath) {
                return grunt.file.isFile(filePath)
                    && hasSuffix(suffixes, filePath.toLowerCase());
            }
        };
        // filter and expand glob
        var files = grunt.file.expand(options, glob);
        // resolve file paths
        return _.map(files, function (file) {
            return path.resolve(file);
        });
    }

    function isJasmineReporter(object) {
        return typeof object === 'object'
            && typeof object.jasmineDone === 'function'
            && typeof object.specDone === 'function';
    }

    //-------------------------------------
    //  TASK DEFINITION
    //-------------------------------------

    grunt.registerMultiTask('jasmine_nodejs', 'Jasmine Grunt Task for NodeJS.', function () {
        var task = this,
            // Mark the task as async
            taskComplete = task.async(),
            conf = grunt.config.get([this.name, this.target]),
            jasmine = new Jasmine(),
            enabledReporters = [];

        var options = task.options({
            specNameSuffix: 'spec.js', // string or array
            helperNameSuffix: 'helper.js',
            useHelpers: false,
            showColors: true, // DEPRECATED
            verboseReport: true, // DEPRECATED
            reporters: {}
            // , customReporters: []
        });
        var ropts = options.reporters;

        // HELPER METHODS

        // Handler to be executed witin `reporter.jasmineDone()`. We should
        // execute this callback only once, when all reporters are completed.
        // So we keep a counter.
        var cc = 0;
        function onComplete(passed) {
            cc++;
            if (cc >= enabledReporters.length) {
                if (passed) {
                    grunt.log.ok('Successful!');
                }
                taskComplete(passed);
                cc = 0;
            }
        }

        // Extends default console reporter options
        function getConsoleReporterOpts(opts) {
            return _.extend({
                colors: typeof options.showColors === 'boolean'
                    ? options.showColors : true,
                verbose: typeof options.verboseReport === 'boolean'
                    ? options.verboseReport : true,
                cleanStack: true,
                print: function () {
                    grunt.log.write.apply(this, arguments);
                },
                onComplete: onComplete
            }, opts);
        }

        // Each reporter will call `jasmineDone()` method when test is
        // complete. Here, we need to execute Grunt's async callback. This
        // patch is used for additional built-in reporters and custom
        // reporters. Our console (default) reporter already has an
        // `onComplete` callback.
        function addReporter(reporter, name) {
            if (!isJasmineReporter(reporter)) {
                grunt.log.error(name + ' is not a valid Jasmine reporter.');
                return;
            }
            try {
                // store original callbacks
                var jasmineDone = reporter.jasmineDone,
                    specDone = reporter.specDone;
                // mark whether failed so that we can use this to inform Grunt,
                // when `jasmineDone()` is called.
                reporter.specDone = function (spec) {
                    if (spec.status === 'failed') {
                        this.__failed = true;
                    }
                    specDone(spec);
                };
                // inject our async callback
                reporter.jasmineDone = function () {
                    jasmineDone();
                    onComplete(!this.__failed);
                };
                jasmine.addReporter(reporter);
                enabledReporters.push(name);
            } catch (error) {
                grunt.log.error('Could not add Jasmine reporter: ' + name);
                grunt.log.error(error);
            }
        }

        // BUILT-IN REPORTERS

        // additional Jasmine reporters
        // https://github.com/larrymyers/jasmine-reporters
        if (ropts.junit) {
            var junit = new reporters.JUnitXmlReporter(ropts.junit);
            addReporter(junit, 'JUnit XML Reporter');
        }
        if (ropts.nunit) {
            var nunit = new reporters.NUnitXmlReporter(ropts.nunit);
            addReporter(nunit, 'NUnit XML Reporter');
        }
        if (ropts.teamcity) {
            var teamcity = new reporters.TeamCityReporter(); // no options to set
            addReporter(teamcity, 'TeamCity Reporter');
        }
        if (ropts.tap) {
            var tap = new reporters.TapReporter(); // no options to set
            addReporter(tap, 'TAP Reporter');
        }
        // We won't use terminal reporter since the default reporter is similar and better.
        // if (ropts.terminal && !ropts.console) {
        //     var terminal = new reporters.TerminalReporter(ropts.terminal);
        //     addReporter(terminal, 'Terminal Reporter');
        // }

        // CUSTOM JASMINE REPORTERS

        if (_.isArray(options.customReporters)) {
            options.customReporters.forEach(function (customReporter, index) {
                var name = customReporter && customReporter.name
                    ? customReporter.name
                    : 'Custom Reporter #' + (index + 1);
                addReporter(customReporter, name);
            });
        }

        // DEFAULT REPORTER

        // Finally add the default (console) reporter if set/needed.
        if (enabledReporters.length === 0 || ropts.console) {
            var crOpts = getConsoleReporterOpts(ropts.console),
                consoleReporter = new ConsoleReporter(crOpts);
            jasmine.addReporter(consoleReporter);
            enabledReporters.push(consoleReporter.name);
        }

        grunt.verbose.writeln('Enabled Reporters:\n  ', enabledReporters.join(', ') || 'none');

        // EXECUTE SPEC FILES

        // Spec files
        var specSuffixes = ensureArray(options.specNameSuffix, ','),
            specFiles = expand(conf.specs || [], specSuffixes);
        grunt.verbose.writeln('Spec Files:\n  ', specFiles);

        // Helper files
        if (options.useHelpers && options.helperNameSuffix) {
            var helperSuffixes = ensureArray(options.helperNameSuffix, ','),
                helperFiles = expand(conf.helpers || [], helperSuffixes);
            grunt.verbose.writeln('Helper Files:\n  ', helperFiles);
            specFiles = specFiles.concat(helperFiles);
        }

        // set `.specFiles` property instead of `jasmine.execute(specFiles)`
        // to prevent unnecessary process.
        jasmine.specFiles = specFiles;
        jasmine.execute();
    });
};
