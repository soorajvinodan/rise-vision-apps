'use strict';

angular.module('risevision.store.services')
  .factory('storeFactory', ['$rootScope', '$q', '$state', '$modal',
    '$loading',
    function ($rootScope, $q, $state, $modal,
      $loading) {

      var factory = {};

      var _clearMessages = function () {
        factory.errorMessage = '';
        factory.apiError = '';
      };

      var _init = function () {

        _clearMessages();
      };

      _init();

      factory.checkoutModal = function () {

        _init();

        $modal.open({
          templateUrl: 'partials/store/checkout-modal.html',
          size: 'md',
          controller: 'checkoutModal'
        });
      };

      factory.setError = function (errorMessage, apiError) {
        factory.errorMessage = errorMessage;
        factory.apiError = apiError;
      };

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + '.';
        factory.apiError = e.result && e.result.error.message ?
          e.result.error.message : e.toString();
      };

      return factory;
    }
  ]);
