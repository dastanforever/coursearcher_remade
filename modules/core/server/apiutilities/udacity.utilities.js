

// imports
var mongoose = require('mongoose'),
    Course = mongoose.model('Course'),
    Instructor = mongoose.model('Instructor');
var Type = require('type-of-is');


function getInstructorIds(apiInstructors) {
    instructorIds = [];
    apiInstructors.forEach(function(instructor) {
        console.log(instructor);
        var instructorId;
        if (Instructor.findOne({name: instructor.name}, '_id', function(err, existingInstructor) {
            if(existingInstructor)
                instructorId = existingInstructor._id;
            else if(instructor.name.length > 0) {
                dbinstructor = new Instructor();
                dbinstructor.name = instructor.name;
                dbinstructor.image = instructor.image;
                dbinstructor.bio = instructor.bio;
                dbinstructor.platform = "Udacity";
                dbinstructor.save(function(err) {
                    if(err) {
                        console.log(err);
                }});
                instructorId = dbinstructor._id;
            }
        }));
        instructorIds.push(instructorId);
    }, this);
    return instructorIds;
}

exports.saveCourses = function (result) {
    // for each course, save the course using course controller create.
    if(result['valid'] == true) {
        response = JSON.parse(result['body']);
        elements = response['courses'];
        
        elements.forEach(function(element) {
            if (Course.findOne({platform_id: element.key}, 'name', function(err, existingCourse) {
                if(!existingCourse) {
                    var course = new Course();
                    course.description = element.summary;
                    course.name = element.title;
                    course.link = element.homepage;
                    course.platform_id = element.key;
                    course.instructor_id = getInstructorIds(element.instructors);
                    course.image_url = element.image;
                    course.level = element.level;
                    course.language = element.primaryLanguages;
                    course.source = "Udacity";
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