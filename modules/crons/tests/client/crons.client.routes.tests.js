(function () {
  'use strict';

  describe('Crons Route Tests', function () {
    // Initialize global variables
    var $scope,
      CronsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CronsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CronsService = _CronsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('crons');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/crons');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CronsController,
          mockCron;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('crons.view');
          $templateCache.put('modules/crons/client/views/view-cron.client.view.html', '');

          // create mock Cron
          mockCron = new CronsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cron Name'
          });

          //Initialize Controller
          CronsController = $controller('CronsController as vm', {
            $scope: $scope,
            cronResolve: mockCron
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cronId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cronResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cronId: 1
          })).toEqual('/crons/1');
        }));

        it('should attach an Cron to the controller scope', function () {
          expect($scope.vm.cron._id).toBe(mockCron._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/crons/client/views/view-cron.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CronsController,
          mockCron;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('crons.create');
          $templateCache.put('modules/crons/client/views/form-cron.client.view.html', '');

          // create mock Cron
          mockCron = new CronsService();

          //Initialize Controller
          CronsController = $controller('CronsController as vm', {
            $scope: $scope,
            cronResolve: mockCron
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cronResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/crons/create');
        }));

        it('should attach an Cron to the controller scope', function () {
          expect($scope.vm.cron._id).toBe(mockCron._id);
          expect($scope.vm.cron._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/crons/client/views/form-cron.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CronsController,
          mockCron;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('crons.edit');
          $templateCache.put('modules/crons/client/views/form-cron.client.view.html', '');

          // create mock Cron
          mockCron = new CronsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cron Name'
          });

          //Initialize Controller
          CronsController = $controller('CronsController as vm', {
            $scope: $scope,
            cronResolve: mockCron
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cronId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cronResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cronId: 1
          })).toEqual('/crons/1/edit');
        }));

        it('should attach an Cron to the controller scope', function () {
          expect($scope.vm.cron._id).toBe(mockCron._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/crons/client/views/form-cron.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
