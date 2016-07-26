(function () {
  'use strict';

  angular
    .module('crons')
    .controller('CronsListController', CronsListController);

  CronsListController.$inject = ['CronsService'];

  function CronsListController(CronsService) {
    var vm = this;

    vm.crons = CronsService.query();
  }
})();
