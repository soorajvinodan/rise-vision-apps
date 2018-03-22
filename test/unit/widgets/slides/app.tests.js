'use strict';

describe('Slides app:', function() {
  beforeEach(function () {
    module('risevision.widgets.slides');

    inject(function ($injector) {
      defaultSettings = $injector.get('defaultSettings');
    });
  });


  var defaultSettings;

  describe('defaultSettings: ',function(){

    it('should initialize',function(){
      expect(defaultSettings).to.be.ok;
      expect(defaultSettings).to.be.an('object');
    });

    it('should initialize slides widget settings',function(){
      expect(defaultSettings.slidesWidget).to.be.ok;
      expect(defaultSettings.slidesWidget).to.be.an('object');
      expect(defaultSettings.slidesWidget).to.deep.equal({
        'params': {},
        'additionalParams': {
          'url': '',
          'componentId': ''
        }
      });
    });
  });

});
