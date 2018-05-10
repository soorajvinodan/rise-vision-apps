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

      $scope.RPP_ADDON_ID = 'c4b368be86245bf9501baaa6e0b00df9719869fd';
      $scope.BASIC_PLAN_ID = '40c092161f547f8f72c9f173cd8eebcb9ca5dd25';
      $scope.ADVANCED_PLAN_ID = '93b5595f0d7e4c04a3baba1102ffaecb17607bf4';
      $scope.ENTERPRISE_PLAN_ID = 'b1844725d63fde197f5125b58b6cba6260ee7a57';

      $scope.plans = {};
      $scope.plans[$scope.BASIC_PLAN_ID] = {
        name: 'Basic Plan',
        '01m': 19,
        '01y': 199
      };
      $scope.plans[$scope.ADVANCED_PLAN_ID] = {
        name: 'Advanced Plan',
        '01m': 85,
        '01y': 935
      };
      $scope.plans[$scope.ENTERPRISE_PLAN_ID] = {
        name: 'Enterprise Plan',
        '01m': 489,
        '01y': 5399
      };
      $scope.plans[$scope.RPP_ADDON_ID] = {
        name: 'Licenses',
        '01m': 9,
        '01y': 99
      };

      $scope.order = {
        planId: $scope.BASIC_PLAN_ID,
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

        $scope.errors = $scope.validateAddressRequiredFields($scope.shipTo);

        if ($scope.errors.length > 0) {
          return;
        }

        $scope.currency = ($scope.billTo.country === 'CA') ? 'cad' : 'usd';
        var productId = $scope.order.planId + '-' + $scope.currency + $scope.order.billingPeriod;
        var addonId = $scope.RPP_ADDON_ID + '-' + $scope.currency + $scope.order.billingPeriod;

        $scope.service.calcTaxes($scope.billTo.id, productId, addonId, $scope.order.addonQty,
            $scope.shipTo.street, $scope.shipTo.unit, $scope.shipTo.city, $scope.shipTo.postalCode, $scope.shipTo.state,
            $scope.shipTo.country)
          .then(function (result) {
            $log.info(result);

            if (!result.error && result.result === true) {
              $scope.taxesCalculated = true;
              $scope.taxes = result.taxes || [];
              $scope.total = result.total;
              $scope.totalTax = result.totalTax;
              $scope.shippingTotal = result.shippingTotal;
            } else {
              $log.error(result);
            }

          });
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

      $scope.validateAddressRequiredFields = function (company) {
        var errors = [];
        if (!company.street) {
          errors.push('Missing Address (Line 1)');
        }
        // This check is required by Avalara v2.0 API
        if (company.street && company.street.length > 50) {
          errors.push('Address (Line 1) max length is 50');
        }
        // This check is required by Avalara v2.0 API
        if (company.unit && company.unit.length > 100) {
          errors.push('Address (Line 2) max length is 100');
        }
        // This check is required by Avalara v2.0 API
        if (company.postalCode && company.postalCode.length > 11) {
          errors.push('Postal code max length is 11');
        }
        if (!company.city) {
          errors.push('Missing City');
        }
        if (!company.country) {
          errors.push('Missing Country');
        }
        if (!company.province && (company.country === 'CA' || company.country === 'US')) {
          errors.push('Missing State / Province');
        }
        if (!company.postalCode) {
          errors.push('Missing ZIP / Postal Code');
        }
        return errors;
      };

    }
  ]);
