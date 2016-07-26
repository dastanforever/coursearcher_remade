(function () {
  'use strict';

  // Terms controller
  angular
    .module('terms')
    .controller('TermsController', TermsController);

  TermsController.$inject = ['$scope', '$state', 'Authentication', 'termResolve'];

  function TermsController ($scope, $state, Authentication, term) {
    var vm = this;

    vm.authentication = Authentication;
    vm.term = term;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Term
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.term.$remove($state.go('terms.list'));
      }
    }

    // Save Term
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.termForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.term._id) {
        vm.term.$update(successCallback, errorCallback);
      } else {
        vm.term.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('terms.view', {
          termId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
