'use strict';

angular.module('risevision.store.controllers')
  .controller('checkoutModal', ['$scope', '$modalInstance', 'userState', '$log',
    '$loading', 'storeFactory', 'storeService', 'stripeService',
    'COUNTRIES', 'REGIONS_CA', 'REGIONS_US',
    function ($scope, $modalInstance, userState, $log,
      $loading, storeFactory, storeService, stripeService,
      COUNTRIES, REGIONS_CA, REGIONS_US) {

      $scope.factory = storeFactory;
      $scope.service = storeService;
      $scope.errors = null;

      $scope.countries = COUNTRIES;
      $scope.regionsCA = REGIONS_CA;
      $scope.regionsUS = REGIONS_US;

      var RPP_ADDON_ID = 'c4b368be86245bf9501baaa6e0b00df9719869fd';
      var BASIC_PLAN_ID = '40c092161f547f8f72c9f173cd8eebcb9ca5dd25';

      $scope.order = {
        planId: BASIC_PLAN_ID,
        billingPeriod: '01m',
        addonQty: 0
      };
      $scope.page = 1;

      $scope.billTo = userState.getCopyOfUserCompany();
      $scope.shipTo = userState.getCopyOfSelectedCompany();

      $scope.addr = {
        street: '',
        unit: '',
        city: '',
        province: '',
        postalCode: '',
        country: ''
      };

      var dt = new Date();

      var pmCreditCard = {
        desc: 'Credit Card',
        id: '',
        number: '',
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

      $scope.calcTaxes = function () {

        var currency = ($scope.billTo.country === 'CA') ? 'cad' : 'usd';
        var productId = $scope.order.planId + '-' + currency + $scope.order.billingPeriod;
        var addonId = RPP_ADDON_ID + '-' + currency;

        $scope.service.calcTaxes($scope.billTo.id, productId, addonId, $scope.order.addonQty,
          $scope.shipTo.street, $scope.shipTo.unit, $scope.shipTo.city, $scope.shipTo.postalCode, $scope.shipTo.state,
          $scope.shipTo.country);
        // $scope.factory.calcTaxes($scope.billTo.id, productId, addonId, $scope.order.addonQty,
        //   $scope.billTo.street, $scope.billTo.unit, $scope.billTo.city, $scope.billTo.postalCode, $scope.billTo.state,
        //   $scope.billTo.country,
        //   $scope.shipTo.street, $scope.shipTo.unit, $scope.shipTo.city, $scope.shipTo.postalCode, $scope.shipTo.state,
        //   $scope.shipTo.country);
      };

      $scope.pay = function () {

        if ($scope.paymentMethod.isOnAccount) {
          //TODO: process On Account payment

        } else {
          $scope.payWithCC($scope.paymentMethod, $scope.addr);
        }
      };

      $scope.payWithCC = function (card, addr) {

        if ($scope.validateCard(card, addr)) {

          $loading.start('checkout-modal');

          stripeService.createToken(card.number, card.cvc, card.expMonth, card.expYear, card.name,
            addr.street, addr.unit, addr.city, addr.province, addr.postalCode, addr.country,
            userState.getCopyOfUserCompany() ? userState.getCopyOfUserCompany().isTest : false)

          .then(function (tokenResponse) {
            $log.info(tokenResponse);
            // storeService.purchase(tokenResponse.id, $scope.paymentMethod.isDefault, )
            // .then(function(result) {
            //         if (result.error) {
            //             $loading.stop('checkout-modal');
            //             $scope.errors.push(result.message ? result.message : 'There was an unknown error with the payment.');
            //         } else {
            //             var card = {'id': result.id, 'isDefault': false}; //isDefault was applied when card was added. No need to do it again.
            //             $scope.$emit('paymentForm.payWithCard', {card: card, email: $scope.data.email});
            //         }
            //     },
            //     function() {
            //         $loading.stop('checkout-modal');
            //         $scope.errors = ['There was an unknown error with the payment.'];
            //     }
            // );
          }, function () {
            $loading.stop('checkout-modal');
            $scope.errors = ['There was an unknown error with the payment.'];
          });

        }
      };

      $scope.validateCard = function (card, addr) {

        $scope.errors = stripeService.validateCard(card.number, card.cvc, card.expMonth, card.expYear, card.name,
          addr.street, addr.unit, addr.city, addr.province, addr.postalCode, addr.country, card.isNew);

        return $scope.errors.length === 0;
      };

    }
  ]);
