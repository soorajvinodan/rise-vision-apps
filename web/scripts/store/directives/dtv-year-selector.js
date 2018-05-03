'use strict';

angular.module('risevision.store.directives')
  .directive('yearSelector', function () {
    return {
      restrict: 'E',
      template: '<select ng-options="n as n for n in years"></select>',
      replace: 'true',
      scope: {
        ngModel: '='
      },
      controller: ['$scope', function ($scope) {

        var BASE_YEAR = 2018;
        var MAX_COUNT = 20;
        $scope.years = [];

        $scope.init = function () {

          if ($scope.ngModel < BASE_YEAR) {
            $scope.years.push($scope.ngModel);
          }

          for (var i = 0; i < MAX_COUNT; i++) {
            $scope.years.push(BASE_YEAR + i);
          }
        };

        $scope.init();
      }]

    };
  });
