'use strict';
angular.module('risevision.widgets.slides')
  .controller('SlidesSettingsController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
      
      $scope.$watch( 'settings.additionalParams.url', function(screenName) {
        if (screenName) {
          $scope.settings.additionalParams.componentId = 'rise-slides-' + Math.random().toString().substring(2);
        }
      });
    }
  ]);
