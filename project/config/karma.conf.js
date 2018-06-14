/*global module: false, require: false */

module.exports = function (config) {
    'use strict';

    var mainJSFile = require('../../bower.json').main;
    var commons = require('js-project-commons');

    commons.tools.karma(config, {
        files: [
            'test/helpers/**/*.js',
            mainJSFile,
            'test/spec/**/*.js'
        ]
    }, mainJSFile);
};
