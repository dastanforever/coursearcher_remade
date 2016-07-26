'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Instructor Schema
 */
var InstructorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Instructor name',
    trim: true
  },
  platform: {
    type: String,
    default: 'Random'
  },
  courses: {
    type: Array,
    default: []
  },
  bio: {
    type: String,
    default: "We don't have much info."
  },
  image: {
    type: String,
    default: "Default Image URL."
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

mongoose.model('Instructor', InstructorSchema);
