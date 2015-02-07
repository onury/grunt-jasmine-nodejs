module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jasmine_nodejs: grunt.file.readYAML('config/jasmine.conf.yml')
    });

    // grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['jasmine_nodejs']);

};
