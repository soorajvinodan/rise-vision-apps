'use strict';
angular.module('risevision.widgets.slides')
  .controller('SlidesSettingsController', ['$scope', '$rootScope', 'urlValidator',
    function ($scope, $rootScope, urlValidator) {
      $scope.isUrlValid = true;

      function validateUrl() {
        if ($scope.settings.additionalParams.url.indexOf("docs.google.com/presentation") !== -1) {
          urlValidator.isValid($scope.settings.additionalParams.url).then(function() {
            $scope.isUrlValid = true;
            $scope.settingsForm.$setValidity( "url", $scope.isUrlValid );
            $scope.settings.additionalParams.componentId = 'rise-slides-' + Math.random().toString().substring(2);
          }, function() {
            $scope.isUrlValid = false;
            $scope.settingsForm.$setValidity( "url", $scope.isUrlValid );
          })
        } else {
          $scope.isUrlValid = false;
          $scope.settingsForm.$setValidity( "url", $scope.isUrlValid );
        }
      }

      $scope.$watch( "settings.additionalParams.url", function( newUrl, oldUrl ) {
        if ( typeof newUrl !== "undefined" ) {
          if ( newUrl !== oldUrl ) {
            if ( newUrl !== "") {
              validateUrl();
            }
          }
        }
      } );

      $scope.checkUrl = function () {
        if ($scope.settings && $scope.settings.additionalParams && $scope.settings.additionalParams.url !== "") {
          validateUrl();
        }
      }

      $scope.checkUrl();
    }
  ]);
