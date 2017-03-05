/* eslint camelcase:0 */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jasmine_nodejs: grunt.file.readYAML('config/jasmine.conf.yml')
    });

    // grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadTasks('tasks');

    grunt.registerTask('single', ['jasmine_nodejs:other']);
    grunt.registerTask('helpers', ['jasmine_nodejs:helpersTest']);
    grunt.registerTask('default', ['jasmine_nodejs:calc', 'jasmine_nodejs:other']);

};
