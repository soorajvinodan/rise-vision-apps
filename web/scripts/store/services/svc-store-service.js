(function () {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.store.services')
    .service('storeService', ['$rootScope', '$q', '$log', 'storeAPILoader',
      'userState',
      function ($rootScope, $q, $log, storeAPILoader, userState) {

        var service = {
          calcTaxes: function (companyId, planId, addonId, addonQty,
            line1, line2, city, postalCode, state, country) {
            var deferred = $q.defer();

            var obj = {
              'companyId': companyId,
              'planId': planId,
              'addonId': addonId,
              'addonQty': addonQty,
              'line1': line1,
              'line2': line2,
              'city': city,
              'country': country,
              'state': state,
              'zip': postalCode
            };

            $log.debug('tax estimate called with', companyId);
            storeAPILoader().then(function (storeApi) {
                return storeApi.tax.estimate(obj);
              })
              .then(function (resp) {
                $log.debug('tax estimate resp', resp);
                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to get tax estimate.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        };

        return service;
      }
    ]);
})();
