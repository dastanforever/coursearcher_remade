'use strict';

/**
 * Module dependencies
 */
var instructorsPolicy = require('../policies/instructors.server.policy'),
  instructors = require('../controllers/instructors.server.controller');

module.exports = function(app) {
  // Instructors Routes
  app.route('/api/instructors').all(instructorsPolicy.isAllowed)
    .get(instructors.list)
    .post(instructors.create);

  app.route('/api/instructors/:instructorId').all(instructorsPolicy.isAllowed)
    .get(instructors.read)
    .put(instructors.update)
    .delete(instructors.delete);

  // Finish by binding the Instructor middleware
  app.param('instructorId', instructors.instructorByID);
};
