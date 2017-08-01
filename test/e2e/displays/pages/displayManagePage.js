'use strict';
var DisplayManagePage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));
  var displayNameField = element(by.model('display.name'));
  var downloadPlayerButton = element(by.id('downloadPlayer'));
  var downloadWindows64Button = element(by.id('downloadWindows64'));
  var installPlayerButton = element(by.css('.btn-install-player'));
  var displayUseCompanyAddressCheckbox = element(by.model('display.useCompanyAddress'));
  var displayRebootCheckbox = element(by.model('display.restartEnabled'));
  var viewScheduleLink = element(by.id('viewSchedule'));

  var displayTimeZoneSelect = element(by.model('display.timeZoneOffset'));  

  var displayHoursField = element(by.model('hours'));
  var displayMinutesField = element(by.model('minutes'));
  var displayMeridianButton = element(by.id('meridianButton'));

  var playerProTrialButton = element(by.id('playerProTrialButton'));
  var subscribePlayerProButton = element(by.id('subscribePlayerProButton'));

  var subscriptionStatusBar = element(by.id('subscription-status'));

  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));

  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));

  var displayLoader = element(by.id('display-loader'));

  this.getDisplaysAppContainer = function() {
    return displaysAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getDisplayNameField = function() {
    return displayNameField;
  };

  this.getDownloadPlayerButton = function() {
    return downloadPlayerButton;
  };

  this.getDownloadWindows64Button = function() {
    return downloadWindows64Button;
  };

  this.getInstallPlayerButton = function() {
    return installPlayerButton;
  };

  this.getDisplayUseCompanyAddressCheckbox = function() {
    return displayUseCompanyAddressCheckbox;
  };

  this.getDisplayRebootCheckbox = function() {
    return displayRebootCheckbox;
  };

  this.getViewScheduleLink = function() {
    return viewScheduleLink;
  };

  this.getDisplayTimeZoneSelect = function() {
    return displayTimeZoneSelect;
  };

  this.getDisplayHoursField = function() {
    return displayHoursField;
  };

  this.getDisplayMinutesField = function() {
    return displayMinutesField;
  };

  this.getDisplayMeridianButton = function() {
    return displayMeridianButton;
  };

  this.getPlayerProTrialButton = function() {
    return playerProTrialButton;
  };

  this.getSubscribePlayerProButton = function() {
    return subscribePlayerProButton;
  };

  this.getSubscriptionStatusBar = function() {
    return subscriptionStatusBar;
  };

  this.getSaveButton = function() {
    return saveButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

  this.getDeleteButton = function() {
    return deleteButton;
  };

  this.getDeleteForeverButton = function() {
    return deleteForeverButton;
  };

  this.getDisplayLoader = function() {
    return displayLoader;
  };
};

module.exports = DisplayManagePage;
