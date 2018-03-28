'use strict';

angular.module('risevision.widgets.services')
  .factory( 'urlValidator', [ '$log', '$http', '$q', function( $log, $http, $q ) {
    var SUCCESSFUL_RESPONSE_CODE =  200;
    var factory = {
      isValid: function( url ) {
        var deferred = $q.defer();
        if (testUrl(url)) {
          $http( {
            method: 'GET',
            url: url
          } ).then( function( response ) {
            if ( response && response.status === SUCCESSFUL_RESPONSE_CODE ) {
              deferred.resolve(response);
            } else {
              deferred.reject(response);
              logError(response);
            }
          }, function( response ) {
            deferred.reject(response);
            logError(response);
          } );
        } else {
          deferred.reject(new Error('Url regexp test failed'));
          $log.debug('Url regexp test failed');
        }
        return deferred.promise;
      }
    };

    var testUrl = function (value) {
      var urlRegExp,
        isValidRegex;

      /*
       Discussion
       http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links#21925491
       Using
       https://gist.github.com/dperini/729294
       Reasoning
       http://mathiasbynens.be/demo/url-regex */

      urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; // jshint ignore:line

      isValidRegex = urlRegExp.test(value);

      return isValidRegex;
    }

    var logError = function (response) {
      $log.debug( 'Validation request failed with status code ' + response.status + ': ' + response.statusText );
    }

    return factory;
  } ] );
