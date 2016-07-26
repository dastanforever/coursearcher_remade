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

var courseraParams = {
    start:0,
    limit:20,
    fields:'id, slug,name,primaryLanguages,photoUrl,instructorIds,description,previewLink'
}

var CronJob = require('cron').CronJob;

var getCourseraListJob = new CronJob('* */30 * * * *', function() {
    // make request library.
    utilities.requestApi('https://api.coursera.org/api/courses.v1', courseraParams, 'GET', coursera.saveCourses);
    courseraParams[start] += courseraParams[start] + courseraParams[limit];
  }, function () {
    /* This function is executed when the job stops */
  },
  true
);

getCourseraListJob.start();
