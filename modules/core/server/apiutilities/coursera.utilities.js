
// imports
var mongoose = require('mongoose'),
    Course = mongoose.model('Course');
var Type = require('type-of-is');
//    courseController = require('./controllers/courses.server.controller');

exports.saveCourses = function (result) {
    // for each course, save the course using course controller create.
    if(result['valid'] == true) {
        response = JSON.parse(result['body']);
        elements = response['elements'];
        
        elements.forEach(function(element) {
            //var course = new Course()
            console.log(element);
        }, this);
    }
}