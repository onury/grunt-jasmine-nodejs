# grunt-jasmine-nodejs

Jasmine (v2.x) Grunt multi-task for NodeJS with built-in reporters such as Default (Console) Reporter, JUnit XML, NUnit XML, TeamCity, TAP Reporter. Supports the latest Jasmine features such as `fdescribe`, `fit`, `beforeAll`, `afterAll`, etc...

> Version: 1.0.2  
> Author: Onur Yıldırım (onury) © 2015  
> Licensed under the MIT License.  

![Example Screenshot](https://raw.github.com/onury/grunt-jasmine-nodejs/master/screenshots/verbose-report.jpg)

## Getting Started

This plugin requires Grunt `^0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jasmine-nodejs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jasmine-nodejs');
```

## jasmine_nodejs task

_Run this task with the `grunt jasmine_nodejs` command._  
_The `--verbose` option will additionally output list of enabled reporters, spec and helper file lists._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### specNameSuffix

Type: `String|Array`  Default: `"spec.js"`  
Case-insensitive suffix(es) for the spec files, including the extension. Only files ending with this suffix will be executed within the specified `specs` destination(s).

#### helperNameSuffix

Type: `String|Array`  Default: `"helper.js"`  
Case-insensitive suffix(es) for the helper files, including the extension. Only files ending with this suffix will be executed within the specified `helpers` destination(s).

#### useHelpers

Type: `Boolean`  Default: `true`  
Specifies whether to execute the helper files.

#### reporters

Type: `Object`  Default: `undefined`  
Defines a list of built-in Jasmine reporter configurations to be used. If omitted, `console` reporter will be used as default. See the definitions and corresponding options for each reporter below.  

- **reporters.console**  
    The built-in default reporter that outputs the detailed test results to the console, with colors.  

    + **colors** — Type: `Boolean` Default: `true`  
    Specifies whether the output should have colored text.  

    + **cleanStack** — Type: `Boolean` Default: `true`  
    Specifies whether to filter out lines with jasmine-core path from stacks.  

    + **verbose** — Type: `Boolean` Default: `true`  
    Specifies whether the reporter output should be verbose.  

- **reporters.junit**  
    JUnit XML Reporter that outputs test results to a file in JUnit XML Report format. The default option values are set to create as few .xml files as possible. It is possible to save a single XML file, or an XML file for each top-level `describe`, or an XML file for each `describe` regardless of nesting.  

    + **savePath** — Type: `String` Default: `""`  
    Defines the directory path to save output report files. This directory will be automatically created if it does not already exist.  

    + **filePrefix** — Type: `String` Default: `"junitresults-"`  
    Defines the string value that is prepended to the XML output file. If `consolidateAll` is true, the default is simply `"junitresults"` and this becomes the actual filename, i.e. `"junitresults.xml"`.  

    + **consolidateAll** — Type: `Boolean` Default: `true`  
    Specifies whether to save all test results in a single file. If set to `true`, `filePrefix` is treated as the full file name (excluding extension).  

    + **consolidate** — Type: `Boolean` Default: `true`  
    Specifies whether to save nested describes within the same file as their parent. Setting to `true` does nothing if `consolidateAll` is also `true`. Setting to `false` will also set `consolidateAll` to `false`.  

    + **useDotNotation** — Type: `Boolean` Default: `true`  
    Specifies whether to separate suite names with dots instead of spaces. e.g. `Class.init` instead of `Class init`.   

- **reporters.nunit**  
    NUnit XML Reporter that outputs test results to a file in NUnit XML Report format. Allows the test results to be used in java based CI systems like Jenkins.  

    + **savePath** — Type: `String` Default: `""`  
    Defines the directory path to save output report files. This directory will be automatically created if it does not already exist.  

    + **filename** — Type: `String` Default: `"nunitresults.xml"`  
    Defines the name of xml output file.  

    + **reportName** — Type: `String` Default: `"Jasmine Results"`  
    Defines the name for parent test-results node.  

- **reporters.teamcity**  
    TeamCity Reporter that outputs test results for the Teamcity build system. There are no options to specify for this reporter. Just set this to `true` or `{}` to enable the reporter.   

- **reporters.tap**  
    Reporter for Test Anything Protocol ([TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol)), that outputs tests results to console. There are no options to specify for this reporter. Just set this to `true` or `{}` to enable the reporter.  

#### customReporters

Type: `Array`  Default: `undefined`  
Defines a list of custom Jasmine reporters to be used. Each item should be an initialized reporter instance with interfaces such as `jasmineDone`, `specDone`, etc...  

### Usage Example

```js
grunt.initConfig({
    jasmine_nodejs: {
        // task specific (default) options
        options: {
            specNameSuffix: "spec.js", // also accepts an array
            helperNameSuffix: "helper.js",
            useHelpers: false,
            // configure one or more built-in reporters
            reporters: {
                console: {
                    colors: true,
                    cleanStack: true,
                    verbose: true
                },
                junit: {
                    savePath: "./reports",
                    filePrefix: "junit-report",
                    consolidate: true,
                    useDotNotation: true
                },
                nunit: {
                    savePath: "./reports",
                    filename: "nunit-report.xml",
                    reportName: "Test Results"
                },
                teamcity: false,
                tap: false
            },
            // add custom Jasmine reporter(s)
            customReporters: []
        },
        your_target: {
            // target specific options
            options: {
                useHelpers: true
            },
            // spec files
            specs: [
                "test/lib/**",
                "test/core/**"
            ],
            helpers: [
                "test/helpers/**"
            ]
        }
    }
});
grunt.loadNpmTasks('grunt-jasmine-nodejs');
```
  
_Note 1: The target-level `reporters` object will override the task-level `reporters` object all together. They will not be merged._

_Note 2: If you're migrating from v0.4.x, task options used for the default reporter (`showColors` and `verboseReport`) are DEPRECATED and will be removed in a future release. Use the new (refactored) `reporters.console.colors` and `reporters.console.verbose` options instead._
  

## Changelog

- **v1.0.1** (2015-03-06)  
    + Fixed Console Reporter symbols and colors for Windows platforms. (Fixes [Issue #6](https://github.com/onury/grunt-jasmine-nodejs/issues/6))  

    ---

- **v1.0.0** (2015-03-04)  
    + Added new reporters: JUnit XML Reporter, NUnit XML Reporter, TeamCity Reporter, TAP Reporter. (Fulfills [Issue #4](https://github.com/onury/grunt-jasmine-nodejs/issues/4)). Implemented using [jasmine-reporters](https://github.com/larrymyers/jasmine-reporters).  
    + Added new task option `reporters`. This object defines enabled reporters to be used in conjunction. See documentation.  
    + Deprecated task options: `showColors` and `verboseReport`. These are refactored under `reporters.console` object.  
    + Added new option for console reporter: `cleanStack`.  
    + Added support for adding custom reporters. See `customReporters` task option.  
    + Better output for Grunt `--verbose` command.  
    + Code revisions and clean-up.  

    ---

- v0.4.1 (2015-03-03)  
    + Fixes for `null` stack trace & peer jasmine-core. ([PR #3](https://github.com/onury/grunt-jasmine-nodejs/pull/3) by [@fiznool](https://github.com/fiznool))  

    ---
  
- v0.4.0 (2015-03-01)  
    + Fixed a concatenation issue that would prevent helper-files from loading. (Fixes [Issue #1](https://github.com/onury/grunt-jasmine-nodejs/issues/1))  
    + Added new task option `verboseReport` which reports a verbose list of all suites.  
    + Improved reporter output.  
    + Updated test example (added helper file).  
    + Code clean-up.  

    ---
  
- v0.3.5 (2015-02-12)  
    + Cleaner error stacks. Filtered out lines with jasmine-core path.  
    + Fixed a typo that caused the task to throw a `TypeError` when a test fails.  
    + Better reporter console output.  

    ---
  
- v0.3.1 (2015-02-07)  
    + Fixed timer (zero elapsed time) issue in `jasmine.reporter.js`.  

    ---
  
- v0.3.0 (2015-02-07)  
    + Updated Jasmine-core to latest version (2.2.1).  
    + Added reporter for Jasmine output.  

  
 