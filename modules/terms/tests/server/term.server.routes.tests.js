'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Term = mongoose.model('Term'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, term;

/**
 * Term routes tests
 */
describe('Term CRUD tests', function () {

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

    // Save a user to the test db and create new Term
    user.save(function () {
      term = {
        name: 'Term name'
      };

      done();
    });
  });

  it('should be able to save a Term if logged in', function (done) {
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

        // Save a new Term
        agent.post('/api/terms')
          .send(term)
          .expect(200)
          .end(function (termSaveErr, termSaveRes) {
            // Handle Term save error
            if (termSaveErr) {
              return done(termSaveErr);
            }

            // Get a list of Terms
            agent.get('/api/terms')
              .end(function (termsGetErr, termsGetRes) {
                // Handle Term save error
                if (termsGetErr) {
                  return done(termsGetErr);
                }

                // Get Terms list
                var terms = termsGetRes.body;

                // Set assertions
                (terms[0].user._id).should.equal(userId);
                (terms[0].name).should.match('Term name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Term if not logged in', function (done) {
    agent.post('/api/terms')
      .send(term)
      .expect(403)
      .end(function (termSaveErr, termSaveRes) {
        // Call the assertion callback
        done(termSaveErr);
      });
  });

  it('should not be able to save an Term if no name is provided', function (done) {
    // Invalidate name field
    term.name = '';

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

        // Save a new Term
        agent.post('/api/terms')
          .send(term)
          .expect(400)
          .end(function (termSaveErr, termSaveRes) {
            // Set message assertion
            (termSaveRes.body.message).should.match('Please fill Term name');

            // Handle Term save error
            done(termSaveErr);
          });
      });
  });

  it('should be able to update an Term if signed in', function (done) {
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

        // Save a new Term
        agent.post('/api/terms')
          .send(term)
          .expect(200)
          .end(function (termSaveErr, termSaveRes) {
            // Handle Term save error
            if (termSaveErr) {
              return done(termSaveErr);
            }

            // Update Term name
            term.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Term
            agent.put('/api/terms/' + termSaveRes.body._id)
              .send(term)
              .expect(200)
              .end(function (termUpdateErr, termUpdateRes) {
                // Handle Term update error
                if (termUpdateErr) {
                  return done(termUpdateErr);
                }

                // Set assertions
                (termUpdateRes.body._id).should.equal(termSaveRes.body._id);
                (termUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Terms if not signed in', function (done) {
    // Create new Term model instance
    var termObj = new Term(term);

    // Save the term
    termObj.save(function () {
      // Request Terms
      request(app).get('/api/terms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Term if not signed in', function (done) {
    // Create new Term model instance
    var termObj = new Term(term);

    // Save the Term
    termObj.save(function () {
      request(app).get('/api/terms/' + termObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', term.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Term with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/terms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Term is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Term which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Term
    request(app).get('/api/terms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Term with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Term if signed in', function (done) {
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

        // Save a new Term
        agent.post('/api/terms')
          .send(term)
          .expect(200)
          .end(function (termSaveErr, termSaveRes) {
            // Handle Term save error
            if (termSaveErr) {
              return done(termSaveErr);
            }

            // Delete an existing Term
            agent.delete('/api/terms/' + termSaveRes.body._id)
              .send(term)
              .expect(200)
              .end(function (termDeleteErr, termDeleteRes) {
                // Handle term error error
                if (termDeleteErr) {
                  return done(termDeleteErr);
                }

                // Set assertions
                (termDeleteRes.body._id).should.equal(termSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Term if not signed in', function (done) {
    // Set Term user
    term.user = user;

    // Create new Term model instance
    var termObj = new Term(term);

    // Save the Term
    termObj.save(function () {
      // Try deleting Term
      request(app).delete('/api/terms/' + termObj._id)
        .expect(403)
        .end(function (termDeleteErr, termDeleteRes) {
          // Set message assertion
          (termDeleteRes.body.message).should.match('User is not authorized');

          // Handle Term error error
          done(termDeleteErr);
        });

    });
  });

  it('should be able to get a single Term that has an orphaned user reference', function (done) {
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

          // Save a new Term
          agent.post('/api/terms')
            .send(term)
            .expect(200)
            .end(function (termSaveErr, termSaveRes) {
              // Handle Term save error
              if (termSaveErr) {
                return done(termSaveErr);
              }

              // Set assertions on new Term
              (termSaveRes.body.name).should.equal(term.name);
              should.exist(termSaveRes.body.user);
              should.equal(termSaveRes.body.user._id, orphanId);

              // force the Term to have an orphaned user reference
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

                    // Get the Term
                    agent.get('/api/terms/' + termSaveRes.body._id)
                      .expect(200)
                      .end(function (termInfoErr, termInfoRes) {
                        // Handle Term error
                        if (termInfoErr) {
                          return done(termInfoErr);
                        }

                        // Set assertions
                        (termInfoRes.body._id).should.equal(termSaveRes.body._id);
                        (termInfoRes.body.name).should.equal(term.name);
                        should.equal(termInfoRes.body.user, undefined);

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
      Term.remove().exec(done);
    });
  });
});
