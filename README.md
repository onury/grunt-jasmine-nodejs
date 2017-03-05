# grunt-jasmine-nodejs [![grunt](http://img.shields.io/badge/grunt-^0.4.5-orange.svg)](http://gruntjs.com)

[![version](http://img.shields.io/npm/v/grunt-jasmine-nodejs.svg)](https://www.npmjs.com/package/grunt-jasmine-nodejs)
[![downloads](http://img.shields.io/npm/dm/grunt-jasmine-nodejs.svg)](https://www.npmjs.com/package/grunt-jasmine-nodejs)
![dependencies](https://david-dm.org/onury/grunt-jasmine-nodejs.svg)
![license](http://img.shields.io/npm/l/grunt-jasmine-nodejs.svg)
![maintained](https://img.shields.io/maintenance/yes/2017.svg)   

Jasmine (v2.x) Grunt multi-task for NodeJS with built-in reporters such as Default (Console) Reporter, JUnit XML, NUnit XML, Terminal Reporter, TeamCity, TAP Reporter. Supports the latest Jasmine features such as `fdescribe`, `fit`, `beforeAll`, `afterAll`, etc...

> Author: Onur Yıldırım (onury) © 2017  
> Licensed under the MIT License.  

![Example Screenshot](https://raw.github.com/onury/grunt-jasmine-nodejs/master/screenshots/verbose-report.jpg)

## Getting Started

This plugin requires Grunt `^0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm i grunt-jasmine-nodejs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jasmine-nodejs');
```

## jasmine_nodejs task

_Run this task with the `grunt jasmine_nodejs` command._  
_The `--verbose` option will additionally output list of enabled reporters, spec and helper file lists._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

The `--filter` option will filter the spec files by their **file names** that match the filter.  
`grunt jasmine_nodejs --filter=foo,bar`

### Options

_**specNameSuffix** and **helperNameSuffix** options are **deprecated**. Use glob notation when defining spec and helper files for any task target._  

**useHelpers** : `Boolean` — Default: `true`  

Specifies whether to execute the helper files.

**helpers** : `Array` — Default: `[]`  

Defines the global helper files to be loaded before running specs. These helpers will be available to all task targets. If you need to define target-specific helpers, define them within the target definition object.

**random** : `Boolean` — Default: `false`  

Specifies whether to run specs in semi-random order. Helpful for detecting inter-dependencies in between the specs.

**seed** : `Number` — Default: `null`  

Sets the randomization seed if randomization is turned on.

**defaultTimeout** : `Number` — Default: `5000`  

By default Jasmine will wait for 5 seconds for an asynchronous spec to finish before causing a timeout failure. If the timeout expires before done is called, the current spec will be marked as failed and suite execution will continue as if done was called. You can set the default timeout value (in milliseconds) globally with this option. To set/change the timeout for a particular spec, just pass a third argument to the spec.

**stopOnFailure** : `Boolean` — Default: `false`  

Specifies whether to stop running further tests, on first expectation-failure. This can be useful if you want to debug your failed specs one by one. _Note: Regardless of this option; the runner will still stop on suite failures (such as errors thrown in `afterAll`, etc) and as normal, Grunt will abort when a task/target fails._

**traceFatal** : `Number|Boolean` — Default: `1`  

On a fatal error (i.e. `uncaughtException`), Grunt exits the process without a stack trace. This option forces Grunt to output the stack trace. Possible integer values: 0 to 2. Set to `1` (or `true`) to only trace fatal errors. Set to `2` to also trace grunt warnings. This can also be achieved by the `grunt --stack` command.

**reporters** : `Object` — Default: `undefined`  

Defines a list of built-in Jasmine reporter configurations to be used. If omitted, `console` reporter will be used as default. See the definitions and corresponding options for each reporter below.  

> _Note that reporters producing command-line output (such as console, terminal, teamcity and tap reporters), are not allowed to run at the same time, to prevent puzzled outputs. If still enabled, only the first one (in respective order) will be used. This is not the case for reporters producing a file._  

- **reporters.console** : `Object`  
    The built-in default reporter that outputs the detailed test results to the console, with colors.  

    + **colors** : `Number|Boolean` — Default: `1`  
    Specifies whether the output should have colored text. Possible integer values: 0 to 2. Set to `1` (or `true`) to enable colors. Set to `2` to use the [ANSI escape codes](https://www.npmjs.com/package/chalk#chalkstyles). Option `2` can be useful if, for example, you're running your tests from a sub-process, and the colors aren't showing up.

    + **cleanStack** : `Number|Boolean` — Default: `1`  
    Specifies the filter level for the error stacks. Possible integer values: 0 to 3. Set to `1` (or `true`) to only filter out lines with jasmine-core path from stacks. Set to `2` to filter out all `node_modules` paths. Set to `3` to also filter out lines with no file path in it.  

    + **verbosity** : `Number|Boolean` — Default: `4`  
    (_alias: `verbose`_) Specifies the verbosity level for the reporter output. Possible integer values: 0 to 4. When a `Boolean` value is passed, `true` defaults to `4` and `false` defaults to `0`. Level 0: reports errors only. Level 1: also displays a summary. Level 2: also reports pending specs. Level 3: additionally displays all suites and specs as a list, except disabled specs. Level 4: also lists disabled specs.  

    + **listStyle** : `String` — Default: `"indent"`  
    Indicates the style of suites/specs list output. Possible values: `"flat"` or `"indent"`. Setting this to `"indent"` provides a better view especially when using nested (describe) suites. This option is only effective when verbosity level is set to `3`, `4` or `true`.  

    + **activity** : `Boolean` — Default: `false`  
    Specifies whether to enable the activity indicator animation that outputs the current spec that is being executed. If your tests log extra data to console, this option should be disabled or they might be overwritten.  

- **reporters.junit** : `Object`  
    JUnit XML Reporter that outputs test results to a file in JUnit XML Report format. The default option values are set to create as few .xml files as possible. It is possible to save a single XML file, or an XML file for each top-level `describe`, or an XML file for each `describe` regardless of nesting.  

    + **savePath** : `String` — Default: `""`  
    Defines the directory path to save output report files. This directory will be automatically created if it does not already exist.  

    + **filePrefix** : `String` — Default: `"junitresults-"`  
    Defines the string value that is prepended to the XML output file. If `consolidateAll` is true, the default is simply `"junitresults"` and this becomes the actual filename, i.e. `"junitresults.xml"`.  

    + **consolidateAll** : `Boolean` — Default: `true`  
    Specifies whether to save all test results in a single file. If set to `true`, `filePrefix` is treated as the full file name (excluding extension).  

    + **consolidate** : `Boolean` — Default: `true`  
    Specifies whether to save nested describes within the same file as their parent. Setting to `true` does nothing if `consolidateAll` is also `true`. Setting to `false` will also set `consolidateAll` to `false`.  

    + **useDotNotation** : `Boolean` — Default: `true`  
    Specifies whether to separate suite names with dots instead of spaces. e.g. `Class.init` instead of `Class init`.  

- **reporters.nunit** : `Object`  
    NUnit XML Reporter that outputs test results to a file in NUnit XML Report format. Allows the test results to be used in java based CI systems like Jenkins.  

    + **savePath** : `String` — Default: `""`  
    Defines the directory path to save output report files. This directory will be automatically created if it does not already exist.  

    + **filename** : `String` — Default: `"nunitresults.xml"`  
    Defines the name of xml output file.  

    + **reportName** : `String` — Default: `"Jasmine Results"`  
    Defines the name for parent test-results node.  

- **reporters.terminal** : `Object`  
    Similar to the default console reporter but simpler.  

    + **color** : `Boolean` — Default: `false`  
    Specifies whether the output should have colored text.  

    + **verbosity** : `Number` — Default: `2`  
    Specifies the verbosity level for the reporter output. Possible integer values: 0 to 3.  

    + **showStack** : `Boolean` — Default: `false`  
    Specifies whether to show stack trace for failed specs.  

- **reporters.teamcity** : `Boolean`  
    TeamCity Reporter that outputs test results for the Teamcity build system. There are no options to specify for this reporter. Just set this to `true` to enable the reporter.   

- **reporters.tap** : `Boolean`  
    Reporter for Test Anything Protocol ([TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol)), that outputs tests results to console. There are no options to specify for this reporter. Just set this to `true` to enable the reporter.  


**customReporters** : `Array` — Default: `undefined`  

Defines a list of custom Jasmine reporters to be used. Each item should be an initialized reporter instance with interfaces such as `jasmineDone`, `specDone`, etc...  

### Usage Example

```js
grunt.initConfig({
    jasmine_nodejs: {
        // task specific (default) options
        options: {
            useHelpers: true,
            // global helpers, available to all task targets. accepts globs..
            helpers: [],
            random: false,
            seed: null,
            defaultTimeout: null, // defaults to 5000
            stopOnFailure: false,
            traceFatal: true,
            // configure one or more built-in reporters
            reporters: {
                console: {
                    colors: true,        // (0|false)|(1|true)|2
                    cleanStack: 1,       // (0|false)|(1|true)|2|3
                    verbosity: 4,        // (0|false)|1|2|3|(4|true)
                    listStyle: "indent", // "flat"|"indent"
                    activity: false
                },
                // junit: {
                //     savePath: "./reports",
                //     filePrefix: "junit-report",
                //     consolidate: true,
                //     useDotNotation: true
                // },
                // nunit: {
                //     savePath: "./reports",
                //     filename: "nunit-report.xml",
                //     reportName: "Test Results"
                // },
                // terminal: {
                //     color: false,
                //     showStack: false,
                //     verbosity: 2
                // },
                // teamcity: true,
                // tap: true
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
                "test/lib/**/*.spec.js",
                "test/core/**/*.spec.js"
            ],
            // target-specific helpers
            helpers: [
                "test/helpers/**/*.helper.js"
            ]
        }
    }
});
grunt.loadNpmTasks('grunt-jasmine-nodejs');
```

_Note: The target-level `reporters` object will override the task-level `reporters` object all together. They will not be merged._


## Change-Log

- **v1.6.0** (2017-03-05)  
    + **`specNameSuffix`** and **`helperNameSuffix`** options are **deprecated**. Use glob notation when defining spec and helper files for any task target.
    + Added **`helpers:Array`** option that defines global helper files that are available to all task targets.
    + Full file paths are now respected, (no need to match suffixes). Fixes [issue #39](https://github.com/onury/grunt-jasmine-nodejs/issues/39).  
    + (#dev) Added more helper tests.
    + Updated dependencies to their latest versions.

    ---

- **v1.5.4** (2016-08-21)  
    + Console Reporter: `cleanStack` option would render the first line as the error message, not respecting messages with `\n` (new-line) in them. Fixed.
    + (#dev) Added before/after tests.
    + Updated dependencies to their latest versions.

    ---

- **v1.5.3** (2016-05-09)  
    + Revised fatal error handler. (issue [#34](https://github.com/onury/grunt-jasmine-nodejs/issues/34).)
    + Updated `jasmine-console-reporter ` which fixes issue [#33](https://github.com/onury/grunt-jasmine-nodejs/issues/33).
    + Updated dependencies to their latest versions.

    ---

- **v1.5.2** (2016-03-18)  
    + Updated dependency `jasmine-console-reporter` which improved the `colors` option to support ANSI escape codes.

    ---

- **v1.5.1** (2016-03-01)  
    + Removed `String.prototype.endsWith()` ES6 method. (Fixes [Issue #32](https://github.com/onury/grunt-jasmine-nodejs/issues/32)).

    ---

- **v1.5.0** (2016-02-26)  
    + Updated Jasmine-Core (v2.4.1) and other dependencies to latest versions.
    + Added new (Jasmine) task options: `random`, `seed` and `defaultTimeout`. See docs.
    + Added new task option: `traceFatal`. See docs. (Fixes [Issue #31](https://github.com/onury/grunt-jasmine-nodejs/issues/31))
    + Moved Console Reporter to its [own repo](https://github.com/onury/jasmine-console-reporter).
    + Updated `peerDependencies` to support Grunt 1.0.
    + Code revisions and clean-up. (Also removed `grunt.util._` refs (deprecated) in favor of `lodash` as a dep.)

    ---

- **v1.4.4** (2016-02-18)  
    + Added the `--filter` option for the task. ([PR @domtronn](https://github.com/onury/grunt-jasmine-nodejs/pull/26))

    ---

- **v1.4.3** (2015-08-15)  
    + Clear require cache to force helper files to be reloaded between executions. ([PR @domtronn](https://github.com/onury/grunt-jasmine-nodejs/pull/23))

    ---

- **v1.4.2** (2015-07-05)  
    + Console Reporter: Expanded `verbosity` levels (0 to 4). Setting to `3` will not report disabled specs anymore while listing others. Set to `4` (default) for the most verbose report. (Fixes [Issue #17](https://github.com/onury/grunt-jasmine-nodejs/issues/17))
    + Console Reporter: `useHelpers` option does actually default to `true` now.
    + Updated Jasmine-Core and other dependencies to their latest versions.

    ---

- **v1.4.0** (2015-05-01)  
    + Updated Jasmine-Core, added support for latest Jasmine version (2.3.0).
    _Note that all `xit` specs are now treated as `disabled` instead of `pending`._  
    + Added New Task Option: `stopOnFailure`. See documentation.  
    + Fixed an issue where the task would exit before completing all targets. (Fixes [Issue #15](https://github.com/onury/grunt-jasmine-nodejs/issues/15))  
    + Revised dependencies. Updated console reporter.  

    ---

- **v1.3.2** (2015-04-27)  
    + Console Reporter: Changed the default value of `report.console.activity` option to `false`. This should not be enabled if your tests log extra data to console. Fixed activity output.  

    ---

- **v1.3.0** (2015-04-21)  
    + Console Reporter: Progressive console output. Each spec result is now output at real-time as it's executed. This effectively helps tracking unhandled errors. (Fixes [Issue #7](https://github.com/onury/grunt-jasmine-nodejs/issues/7))  
    + Console Reporter: Fixed mis-handled _nested_ suites (describe blocks). Each spec result and nested suite is now correctly output in relation to its parent test siute. (Fixes [Issue #10](https://github.com/onury/grunt-jasmine-nodejs/issues/10))  
    + Console Reporter: Highlighted file name, line and column numbers in stacks. Only effective if `reporters.console.colors` is enabled.  
    + Console Reporter: Fixed the stack-filter to support Windows file paths. (Fixes [Issue #11](https://github.com/onury/grunt-jasmine-nodejs/issues/11))  
    + Console Reporter: Improved option: `cleanStack` now also accepts a `Number` (integer) to determine the filter level. See documentation.  
    + Console Reporter: Added new option: `listStyle`. See documentation.  
    + Console Reporter: Improved option: `verbosity` (alias: `verbose`) now also accepts a `Number` (integer) to determine the verbosity level. See documentation.  
    + Console Reporter: Clickable file paths in error stacks (This is useful only if your terminal supports it. For example, <kbd>CMD</kbd>+<kbd>Click</kbd> will open the file and move the cursor to the target line in iTerm 2 for Mac, if [configured](http://adrian-philipp.com/post/iterm-jumpto-sublimetext).)  
    + Console Reporter: Added new option: `activity`. See documentation.
    + **Obselete** task options: Removed `showColors` and `verboseReport`. Use `reporters.console.colors` and `reporters.console.verbosity` options instead.  
    + Enabled terminal reporter (similar to console reporter). Define `reporters.terminal` object to set its options.  
    + Updated dependencies to their latest versions.  

    ---

- **v1.0.2** (2015-03-11)  
    + Console Reporter: Fixed *undefined suite description* issue for focused specs (`fit(...)`); which was breaking the spec-run. (Fixes [Issue #9](https://github.com/onury/grunt-jasmine-nodejs/issues/9))    

    ---

- **v1.0.1** (2015-03-06)  
    + Console Reporter: Fixed symbols and colors for Windows platforms. (Fixes [Issue #6](https://github.com/onury/grunt-jasmine-nodejs/issues/6))  

    ---

- **v1.0.0** (2015-03-04)  
    + Added new reporters: JUnit XML Reporter, NUnit XML Reporter, TeamCity Reporter, TAP Reporter. (Fulfills [Issue #4](https://github.com/onury/grunt-jasmine-nodejs/issues/4)). Implemented using [jasmine-reporters](https://github.com/larrymyers/jasmine-reporters).  
    + Added new task option `reporters`. This object defines enabled reporters to be used in conjunction. See documentation.  
    + Deprecated task options: `showColors` and `verboseReport`. These are refactored under `reporters.console` object.  
    + Console Reporter: Added new option: `cleanStack`.  
    + Added support for adding custom reporters. See `customReporters` task option.  
    + Better output for Grunt `--verbose` command.  
    + Code revisions and clean-up.  

    ---

- v0.4.1 (2015-03-03)  
    + Console Reporter: Fixes for `null` stack trace & peer jasmine-core. ([PR #3](https://github.com/onury/grunt-jasmine-nodejs/pull/3) by [@fiznool](https://github.com/fiznool))  

    ---

- v0.4.0 (2015-03-01)  
    + Fixed a concatenation issue that would prevent helper-files from loading. (Fixes [Issue #1](https://github.com/onury/grunt-jasmine-nodejs/issues/1))  
    + Added new task option `verboseReport` which reports a verbose list of all suites.  
    + Console Reporter: Improved reporter output.  
    + Updated test example (added helper file).  
    + Code clean-up.  

    ---

- v0.3.5 (2015-02-12)  
    + Console Reporter: Cleaner error stacks. Filtered out lines with jasmine-core path.  
    + Fixed a typo that caused the task to throw a `TypeError` when a test fails.  
    + Console Reporter: Better reporter console output.  

    ---

- v0.3.1 (2015-02-07)  
    + Console Reporter: Fixed timer (zero elapsed time) issue.  

    ---

- v0.3.0 (2015-02-07)  
    + Updated Jasmine-core to latest version (2.2.1).  
    + Added reporter for Jasmine output.  
