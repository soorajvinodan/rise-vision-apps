'use strict';

angular.module('risevision.editor.directives')
  .directive('sidebar', ['placeholderFactory', 'placeholderPlaylistFactory', 'playlistItemFactory',
    function (placeholderFactory, placeholderPlaylistFactory, playlistItemFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/editor/sidebar.html',
        link: function ($scope) {
          $scope.playlistItemFactory = playlistItemFactory;
          $scope.placeholderPlaylistFactory = placeholderPlaylistFactory;
          $scope.factory = placeholderFactory;
          $scope.showPlaylist = true;
          $scope.$watch('factory.placeholder', function () {
            $scope.showPlaylist = true;
          });
        } //link()
      };
    }
  ]);
