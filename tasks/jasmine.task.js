/**
 *  Jasmine Grunt Task for NodeJS.
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = function (grunt) {
    'use strict';

    // Core modules
    var path = require('path');

    // Own modules
    var JasmineRunner = require('./lib/jasmine.runner');

    // Dep modules
    var reporters = require('jasmine-reporters'),
        JasmineConsoleReporter = require('jasmine-console-reporter'),
        _ = require('lodash'),
        glob = require('glob');

    // --------------------------------
    //  UTILITY METHODS
    // --------------------------------

    function normalizeSuffixes(suffixes) {
        return typeof suffixes === 'string'
            ? suffixes.split(',')
            : (Array.isArray(suffixes) ? suffixes : null);
    }

    function endsWith(str, suffix) {
        if (!str || !suffix) return false;
        return str.toLowerCase().indexOf(suffix.toLowerCase())
            === str.length - suffix.length;
    }

    function hasSuffix(suffixes, filePath) {
        if (!filePath) return false;
        return (suffixes || []).some(function (suffix) {
            return endsWith(filePath, suffix);
        });
    }

    // TODO: suffixes are deprecated. We'll remove related stuff when we
    // permanently drop suffixes.
    function expand(patterns, suffixes) {
        var globs = [],
            nonGlobs = [];

        // distinguish non-glob, full file paths so that we can add them without
        // needing to check for a suffix-match.
        patterns.forEach(function (pattern) {
            if (glob.hasMagic(pattern)) {
                globs.push(pattern);
            } else if (grunt.file.isFile(pattern)) {
                nonGlobs.push(pattern);
            }
        });

        var suffixesDefined = Array.isArray(suffixes) && suffixes.length > 0;
        var expandOptions = {
            // matchBase: true,
            filter: function (filePath) {
                return grunt.file.isFile(filePath)
                    && (!suffixesDefined || hasSuffix(suffixes, filePath.toLowerCase()));
            }
        };

        // filter and expand globs
        var files = grunt.file.expand(expandOptions, globs);
        // concat non-glob file paths
        files = files.concat(nonGlobs);
        // resolve file paths
        return files.map(function (file) {
            return path.resolve(file);
        });
    }

	// --------------------------------
	//  SPEC FILTERING
	// --------------------------------

    function specFilter(pattern, files) {
        var specPattern,
            patternArray,
            filteredArray = [],
            scriptSpecs = [],
            matchPath = function (path) {
                return Boolean(path.match(specPattern));
            };

        if (pattern) {
            // For '*' to work as a wildcard.
            pattern = pattern.split('*').join('[\\S]*').replace(/\./g, '\\.');
            // This allows for comma separated strings to which we can match the
            // spec files.
            patternArray = pattern.split(',');

            while (patternArray.length > 0) {
                pattern = (patternArray.splice(0, 1)[0]);
                if (pattern.length > 0) {
                    if (pattern.indexOf('/') === -1) {
                        specPattern = new RegExp('(' + pattern + '[^/]*)(?!/)$', 'ig');
                    } else if (pattern.indexOf('/') === 0) {
                        specPattern = new RegExp('(' + pattern + '[^/]*)(?=/)', 'ig');
                    } else {
                        throw new Error('--filter flag seems to be in the wrong format.');
                    }

                    // push is usually faster than concat.
                    [].push.apply(scriptSpecs, files.filter(matchPath));
                }
            }
            filteredArray = _.uniq(scriptSpecs);
        }

        return filteredArray;
    }

    // --------------------------------
    //  TASK DEFINITION
    // --------------------------------

    grunt.registerMultiTask('jasmine_nodejs', 'Jasmine Grunt Task for NodeJS.', function () {
        var task = this,
            // Mark the task as async
            taskComplete = task.async(),
            conf = grunt.config.get([this.name, this.target]);

        var options = task.options({
            // suffixes are deprecated. they no longer default to a predefined
            // value so they must be explicitly set.
            specNameSuffix: null, // 'spec.js',
            helperNameSuffix: null, // 'helper.js',
            helpers: [], // global helpers for all targets
            useHelpers: true,
            random: false,
            seed: null,
            defaultTimeout: null, // defaults to 5000 ms
            stopOnFailure: false,
            traceFatal: true,
            reporters: {}
            // , customReporters: []
        });

        var jasmineRunner = new JasmineRunner({
                stopOnFailure: options.stopOnFailure,
                random: options.random,
                seed: options.seed,
                defaultTimeout: options.defaultTimeout
            }),
            enabledReporters = [],
            ropts = options.reporters,
            helperFiles;

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
            if (Array.isArray(helperFiles)) {
                jasmineRunner.unloadHelpers(helperFiles);
            }
        }

        // Extends default console reporter options
        function getConsoleReporterOpts(opts) {
            opts = opts || {};
            opts.print = function () {
                grunt.log.write.apply(this, arguments);
            };
            // checking this here for the old name `verbose` (now alias).
            opts.verbosity = opts.verbosity === undefined
                ? opts.verbose
                : opts.verbosity;
            return opts;
        }

        function addReporter(reporter) {
            try {
                reporter = jasmineRunner.addReporter(reporter, onComplete);
                enabledReporters.push(reporter.name);
            } catch (error) {
                grunt.log.error(error);
            }
        }

        // BUILT-IN REPORTERS
        // additional Jasmine reporters
        // https://github.com/larrymyers/jasmine-reporters
        var reporter;

        // Reporters that only write to a file:
        if (ropts.junit) {
            reporter = new reporters.JUnitXmlReporter(ropts.junit);
            reporter.name = 'JUnit XML Reporter';
            addReporter(reporter);
        }
        if (ropts.nunit) {
            reporter = new reporters.NUnitXmlReporter(ropts.nunit);
            reporter.name = 'NUnit XML Reporter';
            addReporter(reporter);
        }

        // We will not allow reporters producing command-line output to run at
        // the same time, to prevent puzzled outputs.
        var conflict = Boolean(ropts.console);
        if (!conflict && ropts.terminal) {
            conflict = true;
            reporter = new reporters.TerminalReporter(ropts.terminal);
            reporter.name = 'Terminal Reporter';
            addReporter(reporter);
        }
        if (!conflict && ropts.teamcity) {
            conflict = true;
            reporter = new reporters.TeamCityReporter(); // no options to set
            reporter.name = 'TeamCity Reporter';
            addReporter(reporter);
        }
        if (!conflict && ropts.tap) {
            conflict = true;
            reporter = new reporters.TapReporter(); // no options to set
            reporter.name = 'TAP Reporter';
            addReporter(reporter);
        }

        // CUSTOM JASMINE REPORTERS

        if (Array.isArray(options.customReporters)) {
            options.customReporters.forEach(function (customReporter, index) {
                customReporter.name = customReporter.name
                    || 'Custom Reporter #' + (index + 1);
                addReporter(customReporter);
            });
        }

        // DEFAULT REPORTER

        // Finally add the default (console) reporter if set/needed.
        if (enabledReporters.length === 0 || ropts.console) {
            var crOpts = getConsoleReporterOpts(ropts.console),
                consoleReporter = new JasmineConsoleReporter(crOpts);
            // consoleReporter already has `name` property defined
            addReporter(consoleReporter);
        }

        grunt.verbose.writeln('Enabled Reporters:\n  ', enabledReporters.join(', ') || 'none');

        // UNCAUGHT/FATAL EXCEPTION STACKS

        // On a fatal error (i.e. uncaughtException), Grunt exits the process
        // without a stack trace. We'll force Grunt to output the stack trace.
        // This can be done by the --stack option which is false by default.
        // But this will also output warnings (such as "task failed") in addition
        // to fatal errors.

        // We need a named function to check whether this is previously added.
        // Bec. since this is a "multi" task, this handler will get added
        // every time.
        function _taskFatalHandler_(e) {
            var err = e ? (e.stack || e.message || e) : 'Unknown Error';
            grunt.fatal(err, grunt.fail.code.TASK_FAILURE);
        }
        // The default Grunt handler:
        // function (e) { fail.fatal(e, fail.code.TASK_FAILURE); }

        if (options.traceFatal === 1 || options.traceFatal === true) {
            var handlers = process.listeners('uncaughtException'),
                alreadyAdded = handlers.some(function (handler) {
                    return handler.name === '_taskFatalHandler_';
                });
            if (!alreadyAdded) {
                process.removeAllListeners('uncaughtException');
                // add the handler before any other
                handlers.unshift(_taskFatalHandler_);
                handlers.forEach(function (handler) {
                    process.on('uncaughtException', handler);
                });
            }
        } else if (options.traceFatal === 2) {
            grunt.option('stack', true);
        }

        // EXECUTE SPEC (and HELPER) FILES

        // Spec files
        var specSuffixes = normalizeSuffixes(options.specNameSuffix),
            specFiles = expand(conf.specs || [], specSuffixes),
            gruntFilter = grunt.option('filter');

        grunt.verbose.writeln('Spec Files:\n  ', specFiles);

        if (gruntFilter) {
            specFiles = specFilter(gruntFilter, specFiles);
            grunt.verbose.writeln('Filtered Spec Files:\n  ', specFiles);
        }

        // Helper files
        grunt.verbose.writeln(options.useHelpers ? 'Loading helpers...' : 'Helpers are disabled!');
        if (options.useHelpers) {
            var helperSuffixes = normalizeSuffixes(options.helperNameSuffix);
            // merge global and target helpers
            helperFiles = (conf.helpers || []).concat(options.helpers || []);
            helperFiles = expand(helperFiles, helperSuffixes);
            grunt.verbose.writeln('Helper Files:\n  ', helperFiles);
            jasmineRunner.loadHelpers(helperFiles);
        }

        jasmineRunner.loadSpecs(specFiles);
        jasmineRunner.execute();
    });
};
