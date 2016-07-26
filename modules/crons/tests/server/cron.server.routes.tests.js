'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cron = mongoose.model('Cron'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, cron;

/**
 * Cron routes tests
 */
describe('Cron CRUD tests', function () {

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

    // Save a user to the test db and create new Cron
    user.save(function () {
      cron = {
        name: 'Cron name'
      };

      done();
    });
  });

  it('should be able to save a Cron if logged in', function (done) {
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

        // Save a new Cron
        agent.post('/api/crons')
          .send(cron)
          .expect(200)
          .end(function (cronSaveErr, cronSaveRes) {
            // Handle Cron save error
            if (cronSaveErr) {
              return done(cronSaveErr);
            }

            // Get a list of Crons
            agent.get('/api/crons')
              .end(function (cronsGetErr, cronsGetRes) {
                // Handle Cron save error
                if (cronsGetErr) {
                  return done(cronsGetErr);
                }

                // Get Crons list
                var crons = cronsGetRes.body;

                // Set assertions
                (crons[0].user._id).should.equal(userId);
                (crons[0].name).should.match('Cron name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Cron if not logged in', function (done) {
    agent.post('/api/crons')
      .send(cron)
      .expect(403)
      .end(function (cronSaveErr, cronSaveRes) {
        // Call the assertion callback
        done(cronSaveErr);
      });
  });

  it('should not be able to save an Cron if no name is provided', function (done) {
    // Invalidate name field
    cron.name = '';

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

        // Save a new Cron
        agent.post('/api/crons')
          .send(cron)
          .expect(400)
          .end(function (cronSaveErr, cronSaveRes) {
            // Set message assertion
            (cronSaveRes.body.message).should.match('Please fill Cron name');

            // Handle Cron save error
            done(cronSaveErr);
          });
      });
  });

  it('should be able to update an Cron if signed in', function (done) {
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

        // Save a new Cron
        agent.post('/api/crons')
          .send(cron)
          .expect(200)
          .end(function (cronSaveErr, cronSaveRes) {
            // Handle Cron save error
            if (cronSaveErr) {
              return done(cronSaveErr);
            }

            // Update Cron name
            cron.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Cron
            agent.put('/api/crons/' + cronSaveRes.body._id)
              .send(cron)
              .expect(200)
              .end(function (cronUpdateErr, cronUpdateRes) {
                // Handle Cron update error
                if (cronUpdateErr) {
                  return done(cronUpdateErr);
                }

                // Set assertions
                (cronUpdateRes.body._id).should.equal(cronSaveRes.body._id);
                (cronUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Crons if not signed in', function (done) {
    // Create new Cron model instance
    var cronObj = new Cron(cron);

    // Save the cron
    cronObj.save(function () {
      // Request Crons
      request(app).get('/api/crons')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cron if not signed in', function (done) {
    // Create new Cron model instance
    var cronObj = new Cron(cron);

    // Save the Cron
    cronObj.save(function () {
      request(app).get('/api/crons/' + cronObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', cron.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cron with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/crons/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cron is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cron which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cron
    request(app).get('/api/crons/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cron with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cron if signed in', function (done) {
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

        // Save a new Cron
        agent.post('/api/crons')
          .send(cron)
          .expect(200)
          .end(function (cronSaveErr, cronSaveRes) {
            // Handle Cron save error
            if (cronSaveErr) {
              return done(cronSaveErr);
            }

            // Delete an existing Cron
            agent.delete('/api/crons/' + cronSaveRes.body._id)
              .send(cron)
              .expect(200)
              .end(function (cronDeleteErr, cronDeleteRes) {
                // Handle cron error error
                if (cronDeleteErr) {
                  return done(cronDeleteErr);
                }

                // Set assertions
                (cronDeleteRes.body._id).should.equal(cronSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Cron if not signed in', function (done) {
    // Set Cron user
    cron.user = user;

    // Create new Cron model instance
    var cronObj = new Cron(cron);

    // Save the Cron
    cronObj.save(function () {
      // Try deleting Cron
      request(app).delete('/api/crons/' + cronObj._id)
        .expect(403)
        .end(function (cronDeleteErr, cronDeleteRes) {
          // Set message assertion
          (cronDeleteRes.body.message).should.match('User is not authorized');

          // Handle Cron error error
          done(cronDeleteErr);
        });

    });
  });

  it('should be able to get a single Cron that has an orphaned user reference', function (done) {
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

          // Save a new Cron
          agent.post('/api/crons')
            .send(cron)
            .expect(200)
            .end(function (cronSaveErr, cronSaveRes) {
              // Handle Cron save error
              if (cronSaveErr) {
                return done(cronSaveErr);
              }

              // Set assertions on new Cron
              (cronSaveRes.body.name).should.equal(cron.name);
              should.exist(cronSaveRes.body.user);
              should.equal(cronSaveRes.body.user._id, orphanId);

              // force the Cron to have an orphaned user reference
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

                    // Get the Cron
                    agent.get('/api/crons/' + cronSaveRes.body._id)
                      .expect(200)
                      .end(function (cronInfoErr, cronInfoRes) {
                        // Handle Cron error
                        if (cronInfoErr) {
                          return done(cronInfoErr);
                        }

                        // Set assertions
                        (cronInfoRes.body._id).should.equal(cronSaveRes.body._id);
                        (cronInfoRes.body.name).should.equal(cron.name);
                        should.equal(cronInfoRes.body.user, undefined);

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
      Cron.remove().exec(done);
    });
  });
});
