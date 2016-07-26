'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  image_url: {
    type: String,
    default: '' // default course image link.
  },
  link: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'dollars'
  },
  source: {
    type: String,
    default: 'other'
  },
  instructor_id: {
    type: Schema.ObjectId,
//    default: 1,
//    ref: 'Instructor'
  },
  description: {
    type: String,
    default: ""
  },
  platform_id: {
    type: String,
    default: "",
    index: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Course', CourseSchema);
