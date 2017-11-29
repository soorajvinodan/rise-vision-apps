'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderDrag', ['$document', 'artboardFactory',
    function ($document, artboardFactory) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var startX = 0;
          var startY = 0;

          element.on('mousedown', function ($event) {
            $event.preventDefault();
            startX = $event.pageX - $scope.placeholder.left * artboardFactory.zoomLevel;
            startY = $event.pageY - $scope.placeholder.top * artboardFactory.zoomLevel;
            $document.on('mousemove', mouseMove);
            $document.on('mouseup', mouseUp);
          });

          var mouseMove = function ($event) {
            $scope.$apply(function () {
              var phLeft = $event.pageX - startX;
              var phTop = $event.pageY - startY;

              if(artboardFactory.alignToGrid) {
                var zoomedGridSize = artboardFactory.gridSize* artboardFactory.zoomLevel;
                var offsetLeft = ($event.pageX - startX) % zoomedGridSize;
                if (offsetLeft > (zoomedGridSize / 2)) {
                    phLeft += zoomedGridSize - offsetLeft;
                } else {
                    phLeft -= offsetLeft;
                }

                var offsetTop = ($event.pageY - startY) % zoomedGridSize;
                if (offsetTop > (zoomedGridSize / 2)) {
                    phTop += zoomedGridSize - offsetTop;
                } else {
                    phTop -= offsetTop;
                }
              }  
              $scope.placeholder.top = phTop / artboardFactory.zoomLevel;
              $scope.placeholder.left = phLeft / artboardFactory.zoomLevel;
            });
          };

          var mouseUp = function () {
            $document.off('mousemove', mouseMove);
            $document.off('mouseup', mouseUp);
          };
        } //link()
      };
    }
  ]);
