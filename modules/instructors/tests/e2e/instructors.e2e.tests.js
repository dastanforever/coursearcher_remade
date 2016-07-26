'use strict';

describe('Instructors E2E Tests:', function () {
  describe('Test Instructors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/instructors');
      expect(element.all(by.repeater('instructor in instructors')).count()).toEqual(0);
    });
  });
});
