(function () {
  'use strict';

  angular
    .module('instructors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('instructors', {
        abstract: true,
        url: '/instructors',
        template: '<ui-view/>'
      })
      .state('instructors.list', {
        url: '',
        templateUrl: 'modules/instructors/client/views/list-instructors.client.view.html',
        controller: 'InstructorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Instructors List'
        }
      })
      .state('instructors.create', {
        url: '/create',
        templateUrl: 'modules/instructors/client/views/form-instructor.client.view.html',
        controller: 'InstructorsController',
        controllerAs: 'vm',
        resolve: {
          instructorResolve: newInstructor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Instructors Create'
        }
      })
      .state('instructors.edit', {
        url: '/:instructorId/edit',
        templateUrl: 'modules/instructors/client/views/form-instructor.client.view.html',
        controller: 'InstructorsController',
        controllerAs: 'vm',
        resolve: {
          instructorResolve: getInstructor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Instructor {{ instructorResolve.name }}'
        }
      })
      .state('instructors.view', {
        url: '/:instructorId',
        templateUrl: 'modules/instructors/client/views/view-instructor.client.view.html',
        controller: 'InstructorsController',
        controllerAs: 'vm',
        resolve: {
          instructorResolve: getInstructor
        },
        data:{
          pageTitle: 'Instructor {{ articleResolve.name }}'
        }
      });
  }

  getInstructor.$inject = ['$stateParams', 'InstructorsService'];

  function getInstructor($stateParams, InstructorsService) {
    return InstructorsService.get({
      instructorId: $stateParams.instructorId
    }).$promise;
  }

  newInstructor.$inject = ['InstructorsService'];

  function newInstructor(InstructorsService) {
    return new InstructorsService();
  }
})();
