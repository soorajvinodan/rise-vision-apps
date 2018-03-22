'use strict';
angular.module('risevision.widgets.slides', [
    'risevision.widget.common.widget-button-toolbar',
    'risevision.widgets.services'
  ])
  .run(['defaultSettings', function (defaultSettings) {
    defaultSettings.slidesWidget = {
      'params': {},
      'additionalParams': {
        'url': '',
        'componentId': ''
      }
    };
  }]);
