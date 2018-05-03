'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('HomeCtrl', ['$scope', 'launcherFactory', 'editorFactory',
    'displayFactory', 'storeFactory', '$loading',
    function ($scope, launcherFactory, editorFactory, displayFactory,
      storeFactory, $loading) {
      $scope.launcherFactory = launcherFactory;
      $scope.editorFactory = editorFactory;
      $scope.displayFactory = displayFactory;
      $scope.storeFactory = storeFactory;

      $loading.startGlobal('launcher.loading');

      $scope.$watchGroup([
        'launcherFactory.presentations.loadingItems',
        'launcherFactory.schedules.loadingItems',
        'launcherFactory.displays.loadingItems',
      ], function (newValues) {
        if (!newValues[0]) {
          $loading.stopGlobal('launcher.loading');
          $loading.stop('presentation-list-loader');
        }

        if (!newValues[1]) {
          $loading.stop('schedules-list-loader');
        }

        if (!newValues[2]) {
          $loading.stop('displays-list-loader');
        }
      });

      launcherFactory.load();
    }
  ]); //ctr
