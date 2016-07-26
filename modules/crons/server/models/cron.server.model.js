'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cron Schema
 */
var CronSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Cron name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cron', CronSchema);
