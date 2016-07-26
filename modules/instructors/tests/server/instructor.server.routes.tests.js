'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Instructor = mongoose.model('Instructor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, instructor;

/**
 * Instructor routes tests
 */
describe('Instructor CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Instructor
    user.save(function () {
      instructor = {
        name: 'Instructor name'
      };

      done();
    });
  });

  it('should be able to save a Instructor if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(200)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Handle Instructor save error
            if (instructorSaveErr) {
              return done(instructorSaveErr);
            }

            // Get a list of Instructors
            agent.get('/api/instructors')
              .end(function (instructorsGetErr, instructorsGetRes) {
                // Handle Instructor save error
                if (instructorsGetErr) {
                  return done(instructorsGetErr);
                }

                // Get Instructors list
                var instructors = instructorsGetRes.body;

                // Set assertions
                (instructors[0].user._id).should.equal(userId);
                (instructors[0].name).should.match('Instructor name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Instructor if not logged in', function (done) {
    agent.post('/api/instructors')
      .send(instructor)
      .expect(403)
      .end(function (instructorSaveErr, instructorSaveRes) {
        // Call the assertion callback
        done(instructorSaveErr);
      });
  });

  it('should not be able to save an Instructor if no name is provided', function (done) {
    // Invalidate name field
    instructor.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(400)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Set message assertion
            (instructorSaveRes.body.message).should.match('Please fill Instructor name');

            // Handle Instructor save error
            done(instructorSaveErr);
          });
      });
  });

  it('should be able to update an Instructor if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(200)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Handle Instructor save error
            if (instructorSaveErr) {
              return done(instructorSaveErr);
            }

            // Update Instructor name
            instructor.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Instructor
            agent.put('/api/instructors/' + instructorSaveRes.body._id)
              .send(instructor)
              .expect(200)
              .end(function (instructorUpdateErr, instructorUpdateRes) {
                // Handle Instructor update error
                if (instructorUpdateErr) {
                  return done(instructorUpdateErr);
                }

                // Set assertions
                (instructorUpdateRes.body._id).should.equal(instructorSaveRes.body._id);
                (instructorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Instructors if not signed in', function (done) {
    // Create new Instructor model instance
    var instructorObj = new Instructor(instructor);

    // Save the instructor
    instructorObj.save(function () {
      // Request Instructors
      request(app).get('/api/instructors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Instructor if not signed in', function (done) {
    // Create new Instructor model instance
    var instructorObj = new Instructor(instructor);

    // Save the Instructor
    instructorObj.save(function () {
      request(app).get('/api/instructors/' + instructorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', instructor.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Instructor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/instructors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Instructor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Instructor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Instructor
    request(app).get('/api/instructors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Instructor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Instructor if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(200)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Handle Instructor save error
            if (instructorSaveErr) {
              return done(instructorSaveErr);
            }

            // Delete an existing Instructor
            agent.delete('/api/instructors/' + instructorSaveRes.body._id)
              .send(instructor)
              .expect(200)
              .end(function (instructorDeleteErr, instructorDeleteRes) {
                // Handle instructor error error
                if (instructorDeleteErr) {
                  return done(instructorDeleteErr);
                }

                // Set assertions
                (instructorDeleteRes.body._id).should.equal(instructorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Instructor if not signed in', function (done) {
    // Set Instructor user
    instructor.user = user;

    // Create new Instructor model instance
    var instructorObj = new Instructor(instructor);

    // Save the Instructor
    instructorObj.save(function () {
      // Try deleting Instructor
      request(app).delete('/api/instructors/' + instructorObj._id)
        .expect(403)
        .end(function (instructorDeleteErr, instructorDeleteRes) {
          // Set message assertion
          (instructorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Instructor error error
          done(instructorDeleteErr);
        });

    });
  });

  it('should be able to get a single Instructor that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Instructor
          agent.post('/api/instructors')
            .send(instructor)
            .expect(200)
            .end(function (instructorSaveErr, instructorSaveRes) {
              // Handle Instructor save error
              if (instructorSaveErr) {
                return done(instructorSaveErr);
              }

              // Set assertions on new Instructor
              (instructorSaveRes.body.name).should.equal(instructor.name);
              should.exist(instructorSaveRes.body.user);
              should.equal(instructorSaveRes.body.user._id, orphanId);

              // force the Instructor to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Instructor
                    agent.get('/api/instructors/' + instructorSaveRes.body._id)
                      .expect(200)
                      .end(function (instructorInfoErr, instructorInfoRes) {
                        // Handle Instructor error
                        if (instructorInfoErr) {
                          return done(instructorInfoErr);
                        }

                        // Set assertions
                        (instructorInfoRes.body._id).should.equal(instructorSaveRes.body._id);
                        (instructorInfoRes.body.name).should.equal(instructor.name);
                        should.equal(instructorInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Instructor.remove().exec(done);
    });
  });
});
