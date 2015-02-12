# grunt-jasmine-nodejs

Jasmine Grunt (multi) task for NodeJS. Supports the latest Jasmine (v2.x) features such as `fdescribe`, `fit`, `beforeAll`, `afterAll`, etc...  
  
> Version: 0.3.1  
> Author: Onur Yıldırım (onury) © 2015  
> Licensed under the MIT License.  

![Example Screenshot](https://raw.github.com/onury/grunt-jasmine-nodejs/master/screenshots/success-pending.jpg)

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

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### showColors
Type: `Boolean`  Default: `true`  
Specifies whether the output should have colored text.

#### specNameSuffix
Type: `String|Array`  Default: `"spec.js"`  
Case-insensitive suffix(es) for the spec files, including the extension. Only files ending with this suffix will be executed.

#### helperNameSuffix
Type: `String|Array`  Default: `"helper.js"`  
Case-insensitive suffix(es) for the helper files, including the extension. Only files ending with this suffix will be executed.

#### useHelpers
Type: `Boolean`  Default: `true`  
Specifies whether to execute the helper files.

### Usage Example

```js
grunt.initConfig({
    jasmine_nodejs: {
        // task specific (default) options
        options: {
            showColors: true,
            specNameSuffix: 'spec.js', // also accepts an array
            helperNameSuffix: 'helper.js',
            useHelpers: false
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


## Changelog

 - v0.3.3 (2015-02-12)  
    Fixed a typo that caused the task to throw a `TypeError` when a test fails.
 
 - v0.3.1 (2015-02-07)  
    Fixed timer (zero elapsed time) issue in `jasmine.reporter.js`.  

 - v0.3.0 (2015-02-07)  
    Updated Jasmine-core to latest version (2.2.1). Added reporter for Jasmine output.
