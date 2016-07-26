
// imports
var request = require('request');
var utilities = require('../utilities/core.server.utilities');
var coursera = require('../apiutilities/coursera.utilities');
var udacity = require('../apiutilities/udacity.utilities');

var courseraParams = {
    start:0,
    limit:20,
    fields:'id, slug,name,primaryLanguages,photoUrl,instructorIds,description,previewLink'
}

var CronJob = require('cron').CronJob;

exports.getCourseraListJob = new CronJob('*/3 * * * * *', function() {
    // make request library.
    utilities.requestApi('https://api.coursera.org/api/courses.v1', courseraParams, 'GET', coursera.saveCourses);
    courseraParams.start += courseraParams.start + courseraParams.limit;
  }, function () {
    /* This function is executed when the job stops */
  },
  true
);

exports.getUdacityListJob = new CronJob('*/3 * * * * *', function() {
        utilities.requestApi('https://www.udacity.com/public-api/v0/courses', {}, 'GET', udacity.saveCourses);
    }, function() {
    /* This function is executed when the job stops */
    },
    true
);

courseraInstructorParams = {
    start : 0,
    limit : 20,
    fields : 'photo,bio,firstName,lastName'
}

exports.getInstructorsCoursera = new CronJob('*/3 * * * * *', function() {
        utilities.requestApi('https://api.coursera.org/api/instructors.v1', {}, 'GET', coursera.saveInstructors);
        courseraInstructorParams.start += courseraInstructorParams.start + courseraInstructorParams.limit;
    }, function() {
        /* This function is executed when the job stops */
    },
    true
);