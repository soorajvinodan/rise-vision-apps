'use strict';
angular.module('risevision.widgets.slides')
  .controller('SlidesSettingsController', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
      
      $scope.$watch( 'settings.additionalParams.screenName', function(screenName) {
        if (screenName) {
          $scope.settings.additionalParams.componentId = 'rise-slides-' + Math.random().toString().substring(2);
        }
      });
    }
  ]);
