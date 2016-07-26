//Crons service used to communicate Crons REST endpoints
(function () {
  'use strict';

  angular
    .module('crons')
    .factory('CronsService', CronsService);

  CronsService.$inject = ['$resource'];

  function CronsService($resource) {
    return $resource('api/crons/:cronId', {
      cronId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
