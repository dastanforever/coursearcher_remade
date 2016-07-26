'use strict';

describe('Crons E2E Tests:', function () {
  describe('Test Crons page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/crons');
      expect(element.all(by.repeater('cron in crons')).count()).toEqual(0);
    });
  });
});
