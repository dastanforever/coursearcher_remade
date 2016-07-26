'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var utilities = require('./modules/core/server/utilities/core.server.utilities');
var coursera = require('./modules/core/server/apiutilities/coursera.utilities');
require('dotenv').config({silent: true});


// start server.
var server = app.start();

// start crons.

var request = require('request');

var params = {
    'start':2000,
    'limit':20,
    'fields':'id, slug,name,primaryLanguages,photoUrl,instructorIds,description,previewLink'
}

var resp = utilities.requestApi('https://api.coursera.org/api/courses.v1', params, 'GET', coursera.saveCourses);
//var CronJob = require('cron').CronJob;
//
//var getCourseraListJob = new CronJob('* * * * * *', function() {
//    // make request library.
//    console.log(resp);
//  }, function () {
//    /* This function is executed when the job stops */
//  },
//  true
//);
