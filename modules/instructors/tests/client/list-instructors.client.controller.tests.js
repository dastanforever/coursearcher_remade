(function () {
  'use strict';

  describe('Instructors List Controller Tests', function () {
    // Initialize global variables
    var InstructorsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      InstructorsService,
      mockInstructor;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _InstructorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      InstructorsService = _InstructorsService_;

      // create mock article
      mockInstructor = new InstructorsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Instructor Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Instructors List controller.
      InstructorsListController = $controller('InstructorsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockInstructorList;

      beforeEach(function () {
        mockInstructorList = [mockInstructor, mockInstructor];
      });

      it('should send a GET request and return all Instructors', inject(function (InstructorsService) {
        // Set POST response
        $httpBackend.expectGET('api/instructors').respond(mockInstructorList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.instructors.length).toEqual(2);
        expect($scope.vm.instructors[0]).toEqual(mockInstructor);
        expect($scope.vm.instructors[1]).toEqual(mockInstructor);

      }));
    });
  });
})();
