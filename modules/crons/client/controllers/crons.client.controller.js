(function () {
  'use strict';

  // Crons controller
  angular
    .module('crons')
    .controller('CronsController', CronsController);

  CronsController.$inject = ['$scope', '$state', 'Authentication', 'cronResolve'];

  function CronsController ($scope, $state, Authentication, cron) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cron = cron;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cron
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.cron.$remove($state.go('crons.list'));
      }
    }

    // Save Cron
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cronForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cron._id) {
        vm.cron.$update(successCallback, errorCallback);
      } else {
        vm.cron.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crons.view', {
          cronId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
