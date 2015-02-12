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

    grunt.registerMultiTask('jasmine_nodejs', 'Jasmine Grunt Task for NodeJS.', function () {
        var task = this,
            // Mark the task as async
            taskComplete = task.async(),
            conf = grunt.config.get([this.name, this.target]),
            options,
            specsGlob = conf.specs || [],
            helpersGlob = conf.helpers || [],
            jasmine = new Jasmine();

        options = task.options({
            showColors: true,
            specNameSuffix: 'spec.js', // string or array
            helperNameSuffix: 'helper.js',
            useHelpers: false
        });

        var reporterOptions = {
            showColors: options.showColors,
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
        var EdgeReporter = require('./lib/jasmine.reporter'),
            reporter = new EdgeReporter(reporterOptions);
        jasmine.addReporter(reporter);

        function ensureArray(value, delim) {
            return !_.isArray(value)
                ? value.split(delim)
                : value;
        }

        var suffixes = ensureArray(options.specNameSuffix, ',');
        if (options.useHelpers && options.helperNameSuffix
                && (_.isArray(helpersGlob) && helpersGlob.length > 0)) {
            suffixes.concat(ensureArray(options.helperNameSuffix, ','));
        }

        function hasSuffix(filePath) {
            return _.some(suffixes, function (suffix) {
                return _.endsWith(filePath.toLowerCase(), suffix.toLowerCase());
            });
        }

        var expandOptions = {
                // matchBase: true,
                filter: function (filePath) {
                    return grunt.file.isFile(filePath)
                        && hasSuffix(filePath.toLowerCase());
                }
            },
            specFiles = grunt.file.expand(expandOptions, specsGlob);
        specFiles = _.map(specFiles, function (file) {
            return path.resolve(file);
        });
        grunt.verbose.writeln('Spec Files:\n', specFiles);

        // we could also do:
        // jasmine.loadConfig({
        //     spec_dir: './',
        //     spec_files: specFiles,
        //     helpers: helperFiles
        // });

        // set `.specFiles` property instead of `jasmine.execute(specFiles)`
        // to prevent unnecessary process.
        jasmine.specFiles = specFiles;
        jasmine.execute();
    });
};
