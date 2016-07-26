//Instructors service used to communicate Instructors REST endpoints
(function () {
  'use strict';

  angular
    .module('instructors')
    .factory('InstructorsService', InstructorsService);

  InstructorsService.$inject = ['$resource'];

  function InstructorsService($resource) {
    return $resource('api/instructors/:instructorId', {
      instructorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
