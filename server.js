'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var crons = require('./modules/core/server/crons/courses.cron');
require('dotenv').config({silent: true});


// start server.
var server = app.start();

// start crons.

crons.getCourseraListJob.start();
crons.getUdacityListJob.start();
crons.getInstructorsCoursera.start();