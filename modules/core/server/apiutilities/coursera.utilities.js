
// imports
var mongoose = require('mongoose'),
    Course = mongoose.model('Course'),
    Instructor = mongoose.model('Instructor');
var Type = require('type-of-is');
var utilities = require('../utilities/core.server.utilities');
//    courseController = require('./controllers/courses.server.controller');

exports.saveInstructors = function(result) {
    if (result['valid'] == true) {
        response = JSON.parse(result['body']);
        elements = response['elements'];

        elements.forEach(function(element) {
            if (Instructor.findOne({name: element.fullName}, 'name', function(err, existingInstructor) {    
                if(!existingInstructor && element.fullName.length > 0) {
                    var instructor = new Instructor();
                    instructor.bio = element.bio;
                    instructor.name = element.fullName;
                    instructor.image = element.photo;
                    instructor.platform = "Coursera";
                    instructor.save();
                }
            }));
        }, this);
    }
}

exports.saveCourses = function (result) {
    // for each course, save the course using course controller create.
    if(result['valid'] == true) {
        response = JSON.parse(result['body']);
        elements = response['elements'];

        elements.forEach(function(element) {
            if (Course.findOne({platform_id: element.id}, 'name', function(err, existingCourse) {
                if(!existingCourse) {
                    var course = new Course();
                    course.description = element.description;
                    course.name = element.name;
                    course.link = 'https://www.coursera.org/learn/' + element.slug;
                    course.platform_id = element.id;
                    saveInstructors(element.instructorIds);
                    course.instructor_id = element.instructorIds;
                    course.image_url = element.photoUrl;
                    course.language = element.primaryLanguages;
                    course.source = "Coursera";
                    course.save(function(err){
                        if(err) {
                            console.log(err);
                        }
                    });
                }
            }));
        }, this);
    }
}