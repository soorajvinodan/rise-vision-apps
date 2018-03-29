'use strict';
describe('service: urlValidator:', function() {
  var SUCCESSFUL_RESPONSE_CODE =  200;

  beforeEach(module('risevision.widgets.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('$log',function(){
      return {
        debug : function(){}
      }
    });
  }));

  var urlValidator, $httpBackend;

  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      urlValidator = $injector.get('urlValidator');
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist',function(){
    expect(urlValidator).to.be.ok;
    expect(urlValidator.isValid).to.be.a('function');
  });

  it('should resolve for a valid url', function(done) {
    var url = 'http://test.com'
    $httpBackend.expect('GET', 'http://test.com').respond(200);
    urlValidator.isValid(url)
      .then(function(response) {
        expect(response.status).to.equal(200);
        done();
      });
    setTimeout(function(){
      $httpBackend.flush();
    },10);
  });

  it('should reject for a invalid url format', function(done) {
    var url = 'test.com'
    urlValidator.isValid(url)
      .then(null, function(error){
        expect(error.message).to.equal('Url regexp test failed');
        done();
      });
  });

  it('should reject for a unreachable url', function(done) {
    var url = 'http://test.com'
    $httpBackend.expect('GET', 'http://test.com').respond(400);
    urlValidator.isValid(url)
      .then(null, function(response){
        expect(response.status).to.equal(400);
        done();
      });
    setTimeout(function(){
      $httpBackend.flush();
    },10);
  });
});
