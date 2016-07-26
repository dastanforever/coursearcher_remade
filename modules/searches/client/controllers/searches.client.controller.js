(function () {
  'use strict';

  // Searches controller
  angular
    .module('searches')
    .controller('SearchesController', SearchesController);

  SearchesController.$inject = ['$scope', '$state', 'Authentication', 'searchResolve'];

  function SearchesController ($scope, $state, Authentication, search) {
    var vm = this;

    vm.authentication = Authentication;
    vm.search = search;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Search
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.search.$remove($state.go('searches.list'));
      }
    }

    // Save Search
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.searchForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.search._id) {
        vm.search.$update(successCallback, errorCallback);
      } else {
        vm.search.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('searches.view', {
          searchId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
