(function () {
  'use strict';

  // Instructors controller
  angular
    .module('instructors')
    .controller('InstructorsController', InstructorsController);

  InstructorsController.$inject = ['$scope', '$state', 'Authentication', 'instructorResolve'];

  function InstructorsController ($scope, $state, Authentication, instructor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.instructor = instructor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Instructor
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.instructor.$remove($state.go('instructors.list'));
      }
    }

    // Save Instructor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.instructorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.instructor._id) {
        vm.instructor.$update(successCallback, errorCallback);
      } else {
        vm.instructor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('instructors.view', {
          instructorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
