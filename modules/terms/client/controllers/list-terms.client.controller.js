(function () {
  'use strict';

  angular
    .module('terms')
    .controller('TermsListController', TermsListController);

  TermsListController.$inject = ['TermsService'];

  function TermsListController(TermsService) {
    var vm = this;

    vm.terms = TermsService.query();
  }
})();
