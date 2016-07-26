
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
            if (Course.findOne({platform_id: element.id}, 'name', function(err, existingCourse) {
                if(!existingCourse) {
                    var course = new Course();
                    course.description = element.description;
                    course.name = element.name;
                    course.link = 'https://www.coursera.org/learn/' + element.slug;
                    course.platform_id = element.id;
                    course.instructor_id = element.instructorIds;
                    course.image_url = element.photoUrl;
                    course.language = element.primaryLanguages;
                    course.save(function(err){
                        if(err) {
                            console.log(err);
                        }
                        else {
                            console.log(course);
                        }
                    });
                }
            })); 
        }, this);
    }
}