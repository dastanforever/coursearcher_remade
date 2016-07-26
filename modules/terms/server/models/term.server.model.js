'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Term Schema
 */
var TermSchema = new Schema({
  token: {
    type: String,
    default: '',
    trim: true
  },
  counts: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Term', TermSchema);
