/*jslint node:true, nomen:true, unparam:true, vars:true, plusplus:true */

/**
 *  Jasmine Grunt Task for NodeJS.
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = function (grunt) {
    'use strict';

    var Jasmine = require('jasmine'),
        path = require('path'),
        _ = grunt.util._;

    //-------------------------------------
    //  HELPER METHODS
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

    //-------------------------------------
    //  TASK DEFINITION
    //-------------------------------------

    grunt.registerMultiTask('jasmine_nodejs', 'Jasmine Grunt Task for NodeJS.', function () {
        var task = this,
            // Mark the task as async
            taskComplete = task.async(),
            conf = grunt.config.get([this.name, this.target]),
            options,
            jasmine = new Jasmine();

        options = task.options({
            showColors: true,
            specNameSuffix: 'spec.js', // string or array
            helperNameSuffix: 'helper.js',
            useHelpers: false,
            verboseReport: true
        });

        // Configure Reporter
        var reporterOptions = {
            showColors: options.showColors,
            verboseReport: options.verboseReport,
            print: function () {
                grunt.log.write.apply(this, arguments);
            },
            onComplete: function (passed) {
                if (passed) {
                    grunt.log.ok('Successful!');
                }
                taskComplete(passed);
            }
        };
        // jasmine.configureDefaultReporter(reporterOptions);
        var JasmineReporter = require('./lib/jasmine.reporter'),
            reporter = new JasmineReporter(reporterOptions);
        jasmine.addReporter(reporter);

        // Spec files
        var specSuffixes = ensureArray(options.specNameSuffix, ','),
            specFiles = expand(conf.specs || [], specSuffixes);
        grunt.verbose.writeln('Spec Files:\n', specFiles);

        // Helper files
        if (options.useHelpers && options.helperNameSuffix) {
            var helperSuffixes = ensureArray(options.helperNameSuffix, ','),
                helperFiles = expand(conf.helpers || [], helperSuffixes);
            grunt.verbose.writeln('Helper Files:\n', helperFiles);
            specFiles = specFiles.concat(helperFiles);
        }

        // set `.specFiles` property instead of `jasmine.execute(specFiles)`
        // to prevent unnecessary process.
        jasmine.specFiles = specFiles;
        jasmine.execute();
    });
};
