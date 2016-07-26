'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cron = mongoose.model('Cron'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cron
 */
exports.create = function(req, res) {
  var cron = new Cron(req.body);
  cron.user = req.user;

  cron.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cron);
    }
  });
};

/**
 * Show the current Cron
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cron = req.cron ? req.cron.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cron.isCurrentUserOwner = req.user && cron.user && cron.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(cron);
};

/**
 * Update a Cron
 */
exports.update = function(req, res) {
  var cron = req.cron ;

  cron = _.extend(cron , req.body);

  cron.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cron);
    }
  });
};

/**
 * Delete an Cron
 */
exports.delete = function(req, res) {
  var cron = req.cron ;

  cron.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cron);
    }
  });
};

/**
 * List of Crons
 */
exports.list = function(req, res) { 
  Cron.find().sort('-created').populate('user', 'displayName').exec(function(err, crons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(crons);
    }
  });
};

/**
 * Cron middleware
 */
exports.cronByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cron is invalid'
    });
  }

  Cron.findById(id).populate('user', 'displayName').exec(function (err, cron) {
    if (err) {
      return next(err);
    } else if (!cron) {
      return res.status(404).send({
        message: 'No Cron with that identifier has been found'
      });
    }
    req.cron = cron;
    next();
  });
};
