'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderPlaylist', ['$modal', '$templateCache', '$filter',
    'placeholderPlaylistFactory', 'playlistItemFactory', 'widgetModalFactory',
    'widgetUtils', 'presentationItemFactory', 'placeholderFactory',
    function ($modal, $templateCache, $filter, placeholderPlaylistFactory,
      playlistItemFactory, widgetModalFactory, widgetUtils,
      presentationItemFactory, placeholderFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/editor/placeholder-playlist.html',
        link: function ($scope, $elem) {
          $scope.factory = placeholderPlaylistFactory;
          $scope.widgetUtils = widgetUtils;
          $scope.playlistItemFactory = playlistItemFactory;

          $scope.getDurationTooltip = function (item) {
            var msg = $filter('translate')(
              'editor-app.playlistItem.duration') + ': ';
            if (item.playUntilDone) {
              msg += $filter('translate')(
                'editor-app.playlistItem.playUntilDone');
            } else {
              msg += item.duration + ' ' + $filter('translate')(
                'editor-app.playlistItem.seconds');
            }
            return msg;
          };

          $scope.remove = function (item) {
            var modalInstance = $modal.open({
              template: $templateCache.get(
                'confirm-instance/confirm-modal.html'),
              controller: 'confirmInstance',
              windowClass: 'modal-custom',
              resolve: {
                confirmationTitle: function () {
                  return 'editor-app.details.removePlaylistItem';
                },
                confirmationMessage: function () {
                  return '' +
                    'editor-app.details.removePlaylistItemWarning';
                },
                confirmationButton: function () {
                  return 'editor-app.details.remove';
                },
                cancelButton: null
              }
            });

            modalInstance.result.then(function () {
              placeholderPlaylistFactory.removeItem(item);
            });
          };

          $scope.sortItem = function (evt) {
            var oldIndex = evt.oldIndex;
            var newIndex = evt.newIndex;

            placeholderPlaylistFactory.moveItem(oldIndex, newIndex);
            $scope.$apply();
          };

          $scope.showSettingsModal = function (item) {
            if (item.type === 'widget') {
              widgetModalFactory.showWidgetModal(item);
            } else if (item.type === 'presentation') {
              presentationItemFactory.showSettingsModal(item);
            }
          };

          $scope.isEditable = function (item) {
            if (item.type === 'widget' &&
              (item.objectReference || item.settingsUrl)) {
              return true;
            } else if (item.type === 'presentation') {
              return true;
            } else {
              return false;
            }
          };
        }
      };
    }
  ]);
