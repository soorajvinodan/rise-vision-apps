'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var DisplayAddModalPage = require('./../pages/displayAddModalPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe('Display Manage', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displaysListPage;
    var displayManagePage;
    var displayAddModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      displaysListPage = new DisplaysListPage();
      displayManagePage = new DisplayManagePage();
      displayAddModalPage = new DisplayAddModalPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getDisplays();
      signInPage.signIn();
      helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
      displaysListPage.getDisplayItems().first().element(by.tagName('td')).click();
    });

    it('should load display', function () {
      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
      expect(displayManagePage.getDisplayNameField().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal('TEST_E2E_DISPLAY');
    });

    it('should show User Company Address Checkbox', function () {
      expect(displayManagePage.getDisplayUseCompanyAddressCheckbox().isPresent()).to.eventually.be.true;
    });

    it('should show Reboot Checkbox', function () {
      expect(displayManagePage.getDisplayRebootCheckbox().isPresent()).to.eventually.be.true;
    });

    it('should show Time Selector', function () {
      expect(displayManagePage.getDisplayHoursField().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayMinutesField().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayMeridianButton().isPresent()).to.eventually.be.true;
    });

    it('should show the schedule link', function() {
      helper.wait(displayManagePage.getViewScheduleLink(), 'View Schedule Link');
      expect(displayManagePage.getViewScheduleLink().isDisplayed()).to.eventually.be.true;
    });

    it('should show address options', function(done) {
      displayManagePage.getDisplayUseCompanyAddressCheckbox().click();
      displayManagePage.getDisplayTimeZoneSelect().isDisplayed().then(function (isDisplayed) {
        if (!isDisplayed) {
          displayManagePage.getDisplayUseCompanyAddressCheckbox().click();
        }

        expect(displayManagePage.getDisplayTimeZoneSelect().isDisplayed()).to.eventually.be.true;

        done();
      });

    });

    it('should select timezone',function(done){
      browser.driver.executeScript('window.scrollTo(0,500);').then(function() {
        displayManagePage.getDisplayTimeZoneSelect().element(by.cssContainingText('option', 'Buenos Aires')).click();
        expect(displayManagePage.getDisplayTimeZoneSelect().$('option:checked').getText()).to.eventually.contain('Buenos Aires');

        done();
      })
    });

    it('should show Save Button', function () {
      expect(displayManagePage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(displayManagePage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    it('should save the display', function () {
      displayManagePage.getSaveButton().click();
      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
      expect(displayManagePage.getSaveButton().getText()).to.eventually.equal('Save');
    });

    it('should show correct timezone after reload',function(done){
      browser.refresh();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');

      browser.driver.executeScript('window.scrollTo(0,500);').then(function() {
        expect(displayManagePage.getDisplayTimeZoneSelect().$('option:checked').getText()).to.eventually.contain('Buenos Aires');

        done();
      });
    });

    it('should show the Not Activated Display link, which opens the Display Modal', function() {
      helper.wait(displayManagePage.getNotActivatedPlayerLink(), 'Not Activated Display link');
      expect(displayManagePage.getNotActivatedPlayerLink().isDisplayed()).to.eventually.be.true;

      // Display modal and validate download button
      displayManagePage.getNotActivatedPlayerLink().click();

      helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
      helper.wait(displayAddModalPage.getDownloadWindows64Button(), 'Download Windows 64 Button');
      expect(displayAddModalPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;

      // Close the modal
      displayAddModalPage.getDismissButton().click();

      helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
    });

    it('should show the Install Player button, which opens the Display Modal', function() {
      helper.wait(displayManagePage.getInstallPlayerButton(), 'Install Player Button');
      expect(displayManagePage.getInstallPlayerButton().isDisplayed()).to.eventually.be.true;

      // Display modal and validate download button
      displayManagePage.getInstallPlayerButton().click();

      helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
      helper.wait(displayAddModalPage.getDownloadWindows64Button(), 'Download Windows 64 Button');
      expect(displayAddModalPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;

      // Close the modal
      displayAddModalPage.getDismissButton().click();

      helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
    });

    it('should delete the display', function (done) {
      helper.clickWhenClickable(displayManagePage.getDeleteButton(), 'Display Delete Button').then(function () {
        helper.clickWhenClickable(displayManagePage.getDeleteForeverButton(), 'Display Delete Forever Button').then(function () {
          helper.wait(displaysListPage.getDisplaysAppContainer(), 'Displays List');

          done();
        });
      });
    });
  });
};

module.exports = DisplayAddScenarios;
