'use strict';

/*jshint camelcase: false */

angular.module('risevision.store.services')
  .factory('stripeLoader', ['$q', '$interval', '$window', 'STRIPE_KEY', 'TEST_STRIPE_KEY',
    function ($q, $interval, $window, STRIPE_KEY, TEST_STRIPE_KEY) {
      var factory = {};
      var stripeLoadDefer = $q.defer();
      var checkInterval = $interval(function () {
        if ($window.Stripe) {
          $interval.cancel(checkInterval);
          stripeLoadDefer.resolve($window.Stripe);
        }
      }, 50);

      factory.get = function (asTest) {
        return stripeLoadDefer.promise.then(function (stripeClient) {
          stripeClient.setPublishableKey(asTest ? TEST_STRIPE_KEY : STRIPE_KEY);
          return stripeClient;
        });
      };
      return factory;
    }
  ])
  .service('stripeService', ['$q', '$window', 'stripeLoader',
    function ($q, $window, stripeLoader) {

      var StripeErrors = {
        invalid_number: 'Invalid Card Number.',
        incorrect_number: 'Invalid Card Number.',
        invalid_cvc: 'Invalid Security Code.',
        incorrect_cvc: 'Invalid Security Code.',
        invalid_expiry_month: 'Invalid Exp. Month.',
        invalid_expiry_year: 'Invalid Exp. Year.',
        incorrect_zip: 'Invalid ZIP / Postal Code. The ZIP / Postal Code provided is not associated with the billing address of this card.',
        expired_card: 'The card provided has expired.',
        card_declined: 'The card was declined. Please confirm all information is correct. If the problem continues try a different card.',
        missing: 'No card associated with the account.',
        processing_error: 'Unfortunately there has been an unexpected error. Please try again.'
      };

      var getStripeError = function (errorCode) {

        var message = StripeErrors[errorCode];

        if (!message) {
          message = StripeErrors.processing_error;
        }

        return message;
      };

      this.createToken = function (cardNumber, cvc, expMonth, expYear, cardName, address1, address2, city, province,
        postalCode, country, asTest) {
        var tokenDefer = $q.defer();
        stripeLoader.get(asTest).then(function () {
          $window.Stripe.card.createToken({
            number: cardNumber,
            cvc: cvc,
            exp_month: expMonth,
            exp_year: expYear,
            name: cardName,
            //address fields
            address_line1: address1,
            address_line2: address2,
            address_city: city,
            address_state: province,
            address_zip: postalCode,
            address_country: country
          }, function (status, response) {
            if (response.error) {
              tokenDefer.reject(getStripeError(response.error.code));
            } else {
              tokenDefer.resolve(response);
            }
          });
        });
        return tokenDefer.promise;
      };

      this.validateCard = function (cardNumber, cvc, expMonth, expYear, cardName, address1, address2, city, province,
        postalCode, country, isNew) {
        cardName = cardName ? cardName.trim() : '';
        cardNumber = cardNumber ? cardNumber.trim() : '';
        cvc = cvc ? cvc.trim() : '';
        var errors = [];

        if (isNew) {
          if (!$window.Stripe.card.validateCardNumber(cardNumber)) {
            errors.push(StripeErrors.invalid_number);
          }
          if (!$window.Stripe.card.validateCVC(cvc)) {
            errors.push(StripeErrors.invalid_cvc);
          }
        }

        if (!$window.Stripe.card.validateExpiry(expMonth, expYear)) {
          errors.push('Invalid expiry date');
        }
        if (!cardName) {
          errors.push('Missing Cardholder Name');
        }
        // --- address ---
        if (!address1) {
          errors.push('Missing Address Line 1');
        }
        if (!city) {
          errors.push('Missing City');
        }
        if (!country) {
          errors.push('Missing Country');
        }
        if (!province) {
          errors.push('Missing State / Province');
        }
        if (!postalCode) {
          errors.push('Missing ZIP / Postal Code');
        }
        return errors;
      };
    }
  ]);
