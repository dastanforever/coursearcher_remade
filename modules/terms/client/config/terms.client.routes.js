(function () {
  'use strict';

  angular
    .module('terms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('terms', {
        abstract: true,
        url: '/terms',
        template: '<ui-view/>'
      })
      .state('terms.list', {
        url: '',
        templateUrl: 'modules/terms/client/views/list-terms.client.view.html',
        controller: 'TermsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Terms List'
        }
      })
      .state('terms.create', {
        url: '/create',
        templateUrl: 'modules/terms/client/views/form-term.client.view.html',
        controller: 'TermsController',
        controllerAs: 'vm',
        resolve: {
          termResolve: newTerm
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Terms Create'
        }
      })
      .state('terms.edit', {
        url: '/:termId/edit',
        templateUrl: 'modules/terms/client/views/form-term.client.view.html',
        controller: 'TermsController',
        controllerAs: 'vm',
        resolve: {
          termResolve: getTerm
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Term {{ termResolve.name }}'
        }
      })
      .state('terms.view', {
        url: '/:termId',
        templateUrl: 'modules/terms/client/views/view-term.client.view.html',
        controller: 'TermsController',
        controllerAs: 'vm',
        resolve: {
          termResolve: getTerm
        },
        data:{
          pageTitle: 'Term {{ articleResolve.name }}'
        }
      });
  }

  getTerm.$inject = ['$stateParams', 'TermsService'];

  function getTerm($stateParams, TermsService) {
    return TermsService.get({
      termId: $stateParams.termId
    }).$promise;
  }

  newTerm.$inject = ['TermsService'];

  function newTerm(TermsService) {
    return new TermsService();
  }
})();
