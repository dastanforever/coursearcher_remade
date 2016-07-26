(function () {
  'use strict';

  describe('Terms Route Tests', function () {
    // Initialize global variables
    var $scope,
      TermsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TermsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TermsService = _TermsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('terms');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/terms');
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
          TermsController,
          mockTerm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('terms.view');
          $templateCache.put('modules/terms/client/views/view-term.client.view.html', '');

          // create mock Term
          mockTerm = new TermsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Term Name'
          });

          //Initialize Controller
          TermsController = $controller('TermsController as vm', {
            $scope: $scope,
            termResolve: mockTerm
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:termId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.termResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            termId: 1
          })).toEqual('/terms/1');
        }));

        it('should attach an Term to the controller scope', function () {
          expect($scope.vm.term._id).toBe(mockTerm._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/terms/client/views/view-term.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TermsController,
          mockTerm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('terms.create');
          $templateCache.put('modules/terms/client/views/form-term.client.view.html', '');

          // create mock Term
          mockTerm = new TermsService();

          //Initialize Controller
          TermsController = $controller('TermsController as vm', {
            $scope: $scope,
            termResolve: mockTerm
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.termResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/terms/create');
        }));

        it('should attach an Term to the controller scope', function () {
          expect($scope.vm.term._id).toBe(mockTerm._id);
          expect($scope.vm.term._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/terms/client/views/form-term.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TermsController,
          mockTerm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('terms.edit');
          $templateCache.put('modules/terms/client/views/form-term.client.view.html', '');

          // create mock Term
          mockTerm = new TermsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Term Name'
          });

          //Initialize Controller
          TermsController = $controller('TermsController as vm', {
            $scope: $scope,
            termResolve: mockTerm
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:termId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.termResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            termId: 1
          })).toEqual('/terms/1/edit');
        }));

        it('should attach an Term to the controller scope', function () {
          expect($scope.vm.term._id).toBe(mockTerm._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/terms/client/views/form-term.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
