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
      $scope.errors = [];

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
      //prototype shortcut - copy shipping address into company address
      copyAddressFromShipTo($scope.shipTo, $scope.shipTo);

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

        $scope.service.calcTaxes($scope.billTo.id, $scope.getChargebeePlanId(), $scope.getChargebeeAddonId(),
            $scope.order.addonQty,
            $scope.shipTo.street, $scope.shipTo.unit, $scope.shipTo.city, $scope.shipTo.postalCode, $scope.shipTo.province,
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
      };

      $scope.pay = function () {

        if ($scope.paymentMethod.isOnAccount) {
          $scope.payWithAccount($scope.paymentMethod);
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
              card.id = tokenResponse.id;
              var jsonData = $scope.getOrderAsJson(card);
              storeService.purchase(jsonData)
                .then(function (result) {
                    $loading.stop('checkout-modal');
                    if (result.error) {
                      $scope.errors.push(result.message ? result.message :
                        'There was an unknown error with the payment.');
                    } else {
                      $scope.dismiss();
                    }
                  },
                  function () {
                    $loading.stop('checkout-modal');
                    $scope.errors = ['There was an unknown error with the payment.'];
                  }
                );
            }, function () {
              $loading.stop('checkout-modal');
              $scope.errors = ['There was an unknown error with the payment.'];
            });

        }
      };

      $scope.payWithAccount = function (card) {

        $loading.start('checkout-modal');

        var jsonData = $scope.getOrderAsJson(card);
        storeService.purchase(jsonData)
          .then(function (result) {
              $loading.stop('checkout-modal');
              if (result.error) {
                $scope.errors.push(result.message ? result.message :
                  'There was an unknown error with the payment.');
              } else {
                $scope.dismiss();
              }
            },
            function () {
              $loading.stop('checkout-modal');
              $scope.errors = ['There was an unknown error with the payment.'];
            }
          );

      };

      $scope.getCurrency = function () {
        return ($scope.billTo.country === 'CA') ? 'cad' : 'usd';
      };

      $scope.getChargebeePlanId = function () {
        return $scope.order.planId + '-' + $scope.getCurrency() + $scope.order.billingPeriod;
      };

      $scope.getChargebeeAddonId = function () {
        return $scope.RPP_ADDON_ID + '-' + $scope.getCurrency() + $scope.order.billingPeriod;
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

      $scope.getOrderAsJson = function (card) {
        //clean up items
        var newItems = [{
            'id': $scope.getChargebeePlanId()
          },
          {
            'id': $scope.getChargebeeAddonId(),
            'qty': $scope.order.addonQty
          }
        ];

        var billTo = copyAddress($scope.billTo);
        billTo.id = $scope.billTo.id;

        var shipTo = copyAddress($scope.shipTo);
        shipTo.id = $scope.shipTo.id;

        var cardData = card.isOnAccount ? null : {
          'cardId': card.id,
          'isDefault': card.isDefault
        };

        var obj = {
          'billTo': billTo,
          'shipTo': shipTo,
          'items': newItems,
          'purchaseOrderNumber': card.purchaseOrderNumber,
          'card': cardData
        };
        return JSON.stringify(obj);
      };

      function copyAddress(src) {

        var dest = {};
        dest.street = src.street;
        dest.unit = src.unit;
        dest.city = src.city;
        dest.country = src.country;
        dest.postalCode = src.postalCode;
        dest.province = src.province;

        return dest;
      }

      function copyAddressFromShipTo(src, dest) {

        if (!dest) {
          dest = {};
        }

        dest.street = src.shipToStreet;
        dest.unit = src.shipToUnit;
        dest.city = src.shipToCity;
        dest.country = src.shipToCountry;
        dest.postalCode = src.shipToPostalCode;
        dest.province = src.shipToProvince;

        return dest;
      }

    }
  ]);
