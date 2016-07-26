'use strict';

/**
 * Module dependencies
 */
var termsPolicy = require('../policies/terms.server.policy'),
  terms = require('../controllers/terms.server.controller');

module.exports = function(app) {
  // Terms Routes
  app.route('/api/terms').all(termsPolicy.isAllowed)
    .get(terms.list)
    .post(terms.create);

  app.route('/api/terms/:termId').all(termsPolicy.isAllowed)
    .get(terms.read)
    .put(terms.update)
    .delete(terms.delete);

  // Finish by binding the Term middleware
  app.param('termId', terms.termByID);
};
