'use strict';

angular.module('risevision.store.services')
  .factory('storeFactory', ['$rootScope', '$q', '$state', '$modal', '$log', '$window',
    '$loading', 'storeService',
    function ($rootScope, $q, $state, $modal, $log, $window,
      $loading, storeService) {

      var factory = {};
      
      factory.service = storeService;

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
      
      factory.openPortal = function (companyId) {

    	  _init();
    	  
    	  factory.service.openPortal(companyId, $window.location.href)
            .then(function (result) {
              $log.info(result);

              if (result.result && result.result.length > 0) {
                $window.open(result.result, '_blank');
              } 
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
