'use strict';

describe('SlidesSettingsController', function () {

  var defaultSettings,
    scope,
    rootScope,
    twitterOAuthService;

  beforeEach(module('risevision.widgets.slides'));
  beforeEach(module(mockTranlate()));

  describe('Connection', function () {
    beforeEach(inject(function ($injector, $rootScope, $controller) {
      defaultSettings = $injector.get('defaultSettings');
      scope = $rootScope.$new();
      rootScope = $rootScope;
      
      scope.settingsForm = {
        $setValidity: function () {
          return;
        }
      };

      scope.settings = {
        additionalParams: defaultSettings.slidesWidget.additionalParams
      };

      scope.$digest();
    }));

    it('should define defaultSettings', function () {
      expect(defaultSettings).to.be.ok;
      expect(defaultSettings).to.be.an('object');
    });

    describe('url: ', function() {
      it('should default to empty', function () {
        expect(scope.settings.additionalParams.url).to.be.empty;
      });
    });
  });
});
