(function () {
  'use strict';

  angular
    .module('instructors')
    .controller('InstructorsListController', InstructorsListController);

  InstructorsListController.$inject = ['InstructorsService'];

  function InstructorsListController(InstructorsService) {
    var vm = this;

    vm.instructors = InstructorsService.query();
  }
})();
