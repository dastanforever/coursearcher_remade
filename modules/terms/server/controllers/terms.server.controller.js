'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Term = mongoose.model('Term'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Term
 */
exports.create = function(req, res) {
  var term = new Term(req.body);
  term.user = req.user;

  term.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(term);
    }
  });
};

/**
 * Show the current Term
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var term = req.term ? req.term.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  term.isCurrentUserOwner = req.user && term.user && term.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(term);
};

/**
 * Update a Term
 */
exports.update = function(req, res) {
  var term = req.term ;

  term = _.extend(term , req.body);

  term.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(term);
    }
  });
};

/**
 * Delete an Term
 */
exports.delete = function(req, res) {
  var term = req.term ;

  term.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(term);
    }
  });
};

/**
 * List of Terms
 */
exports.list = function(req, res) { 
  Term.find().sort('-created').populate('user', 'displayName').exec(function(err, terms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(terms);
    }
  });
};

/**
 * Term middleware
 */
exports.termByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Term is invalid'
    });
  }

  Term.findById(id).populate('user', 'displayName').exec(function (err, term) {
    if (err) {
      return next(err);
    } else if (!term) {
      return res.status(404).send({
        message: 'No Term with that identifier has been found'
      });
    }
    req.term = term;
    next();
  });
};
