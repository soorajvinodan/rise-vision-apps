'use strict';

angular.module('risevision.store.controllers')
  .controller('checkoutModal', ['$scope', '$modalInstance', 'userState', 'storeFactory',
    '$log', 'COUNTRIES', 'REGIONS_CA', 'REGIONS_US',
    function ($scope, $modalInstance, userState, storeFactory,
      $log, COUNTRIES, REGIONS_CA, REGIONS_US) {

      $scope.factory = storeFactory;
      $scope.errorMessage = null;

      $scope.countries = COUNTRIES;
      $scope.regionsCA = REGIONS_CA;
      $scope.regionsUS = REGIONS_US;

      var basicPlanId = '40c092161f547f8f72c9f173cd8eebcb9ca5dd25';

      $scope.order = {
        planId: basicPlanId,
        qty: 0
      };
      $scope.page = 1;

      $scope.billTo = userState.getCopyOfUserCompany();
      $scope.shipTo = userState.getCopyOfSelectedCompany();

      var dt = new Date();

      var pmCreditCard = {
        desc: 'Credit Card',
        id: '',
        number: '', //test card 4242424242424242
        name: '',
        expMonth: 1,
        expYear: dt.getFullYear(),
        isDefault: false,
        isNew: true
      };
      var pmOnAccount = {
        desc: 'On Account',
        isOnAccount: true
      };

      $scope.paymentMethods = [pmCreditCard, pmOnAccount];
      $scope.paymentMethod = pmCreditCard;

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      $scope.next = function (pageNumber) {
        $scope.page = pageNumber;
      };

    }
  ]);
