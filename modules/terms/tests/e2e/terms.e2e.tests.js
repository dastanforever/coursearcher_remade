'use strict';

describe('Terms E2E Tests:', function () {
  describe('Test Terms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/terms');
      expect(element.all(by.repeater('term in terms')).count()).toEqual(0);
    });
  });
});
