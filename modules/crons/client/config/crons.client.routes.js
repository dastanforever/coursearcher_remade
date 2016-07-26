(function () {
  'use strict';

  angular
    .module('crons')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crons', {
        abstract: true,
        url: '/crons',
        template: '<ui-view/>'
      })
      .state('crons.list', {
        url: '',
        templateUrl: 'modules/crons/client/views/list-crons.client.view.html',
        controller: 'CronsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crons List'
        }
      })
      .state('crons.create', {
        url: '/create',
        templateUrl: 'modules/crons/client/views/form-cron.client.view.html',
        controller: 'CronsController',
        controllerAs: 'vm',
        resolve: {
          cronResolve: newCron
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Crons Create'
        }
      })
      .state('crons.edit', {
        url: '/:cronId/edit',
        templateUrl: 'modules/crons/client/views/form-cron.client.view.html',
        controller: 'CronsController',
        controllerAs: 'vm',
        resolve: {
          cronResolve: getCron
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Cron {{ cronResolve.name }}'
        }
      })
      .state('crons.view', {
        url: '/:cronId',
        templateUrl: 'modules/crons/client/views/view-cron.client.view.html',
        controller: 'CronsController',
        controllerAs: 'vm',
        resolve: {
          cronResolve: getCron
        },
        data:{
          pageTitle: 'Cron {{ articleResolve.name }}'
        }
      });
  }

  getCron.$inject = ['$stateParams', 'CronsService'];

  function getCron($stateParams, CronsService) {
    return CronsService.get({
      cronId: $stateParams.cronId
    }).$promise;
  }

  newCron.$inject = ['CronsService'];

  function newCron(CronsService) {
    return new CronsService();
  }
})();
