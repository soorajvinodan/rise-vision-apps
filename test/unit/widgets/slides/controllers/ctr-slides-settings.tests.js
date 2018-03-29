'use strict';

describe('SlidesSettingsController', function () {

  var defaultSettings,
    scope,
    rootScope,
    urlValidator;

  beforeEach(module('risevision.widgets.slides'));
  beforeEach(module(mockTranlate()));

  beforeEach(module(function ($provide) {
    $provide.service('urlValidator',function(){
      return {
        isValid : sinon.stub()
      }
    });
  }));

  describe('Connection', function () {
    beforeEach(inject(function ($injector, $rootScope, $controller) {
      defaultSettings = $injector.get('defaultSettings');
      scope = $rootScope.$new();
      rootScope = $rootScope;
      urlValidator = $injector.get('urlValidator');

      $controller('SlidesSettingsController', {
        $scope: scope,
        urlValidator: urlValidator
      });

      scope.settingsForm = {
        $setValidity: function () {
          return;
        }
      };

      scope.settings = {
        additionalParams: defaultSettings.slidesWidget.additionalParams
      };

    }));

    it('should define defaultSettings', function () {
      expect(defaultSettings).to.be.ok;
      expect(defaultSettings).to.be.an('object');
    });

    describe('url: ', function() {
      it('should default to empty', function () {
        expect(scope.settings.additionalParams.url).to.be.empty;
        expect(scope.isUrlValid).to.be.true;
      });

      describe('not google docs url', function () {
        beforeEach(function(){
          scope.settings.additionalParams.url = "https://test.com";
          scope.$digest();
        });

        it('should set valid URL to false if it is not a google docs presentation url', function (done) {
          scope.checkUrl();
          setTimeout(function() {
            expect(scope.isUrlValid).to.be.false;
            done();
          },0);
        });
      });


      describe('google docs url', function () {
        beforeEach(function(){
          scope.settings.additionalParams.url = "https://docs.google.com/presentation/";
          scope.$digest();
        });

        it('should set valid URL true if validator resolves', function (done) {
          urlValidator.isValid.returns(Q.resolve());
          scope.checkUrl();
          setTimeout(function() {
            expect(scope.isUrlValid).to.be.true;
            done();
          },0);
        });

        it('should set valid URL to false if validator reject', function (done) {
          urlValidator.isValid.returns(Q.reject());
          scope.checkUrl();
          setTimeout(function() {
            expect(scope.isUrlValid).to.be.false;
            done();
          },0);
        });
      });
    });
  });
});
