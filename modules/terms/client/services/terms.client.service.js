//Terms service used to communicate Terms REST endpoints
(function () {
  'use strict';

  angular
    .module('terms')
    .factory('TermsService', TermsService);

  TermsService.$inject = ['$resource'];

  function TermsService($resource) {
    return $resource('api/terms/:termId', {
      termId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
