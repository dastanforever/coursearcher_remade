'use strict';

/**
 * Module dependencies
 */
var cronsPolicy = require('../policies/crons.server.policy'),
  crons = require('../controllers/crons.server.controller');

module.exports = function(app) {
  // Crons Routes
  app.route('/api/crons').all(cronsPolicy.isAllowed)
    .get(crons.list)
    .post(crons.create);

  app.route('/api/crons/:cronId').all(cronsPolicy.isAllowed)
    .get(crons.read)
    .put(crons.update)
    .delete(crons.delete);

  // Finish by binding the Cron middleware
  app.param('cronId', crons.cronByID);
};
