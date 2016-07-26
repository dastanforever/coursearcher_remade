'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Instructor = mongoose.model('Instructor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Instructor
 */
exports.create = function(req, res) {
  var instructor = new Instructor(req.body);
  instructor.user = req.user;

  instructor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(instructor);
    }
  });
};

/**
 * Show the current Instructor
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var instructor = req.instructor ? req.instructor.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  instructor.isCurrentUserOwner = req.user && instructor.user && instructor.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(instructor);
};

/**
 * Update a Instructor
 */
exports.update = function(req, res) {
  var instructor = req.instructor ;

  instructor = _.extend(instructor , req.body);

  instructor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(instructor);
    }
  });
};

/**
 * Delete an Instructor
 */
exports.delete = function(req, res) {
  var instructor = req.instructor ;

  instructor.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(instructor);
    }
  });
};

/**
 * List of Instructors
 */
exports.list = function(req, res) { 
  Instructor.find().sort('-created').populate('user', 'displayName').exec(function(err, instructors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(instructors);
    }
  });
};

/**
 * Instructor middleware
 */
exports.instructorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Instructor is invalid'
    });
  }

  Instructor.findById(id).populate('user', 'displayName').exec(function (err, instructor) {
    if (err) {
      return next(err);
    } else if (!instructor) {
      return res.status(404).send({
        message: 'No Instructor with that identifier has been found'
      });
    }
    req.instructor = instructor;
    next();
  });
};
