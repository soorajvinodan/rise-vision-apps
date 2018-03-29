'use strict';
var SlidesSettingsPage = function() {
    var slidesSettingsModal = element(by.id('slidesSettingsModal'));
    var modalTitle = element(by.css('#addWidgetByUrlModal .modal-title'));

    var publishedLinkUrl = element(by.id('publishedLinkUrl'));
    var invalidUrlAlert = element(by.id('invalidUrlAlert'));

    var invalidUrlAlertText = element(by.css('#invalidUrlAlert span'));
    var checkAgainButton = element(by.css('#invalidUrlAlert .btn'));
    var saveButton = element(by.id('save'));
    var cancelButton = element(by.id('cancel'));

    this.getSlidesSettingsModal = function() {
        return slidesSettingsModal;
    }

    this.getModalTitle = function() {
        return modalTitle;
    }

    this.getPublishedLinkUrl = function() {
        return publishedLinkUrl;
    }

    this.getInvalidUrlAlert = function() {
        return invalidUrlAlert;
    }

    this.getCheckAgainButton = function() {
        return checkAgainButton;
    }

    this.getInvalidUrlAlertText = function() {
        return invalidUrlAlertText;
    }

    this.getSaveButton = function() {
        return saveButton;
    }

    this.getCancelButton = function() {
        return cancelButton;
    }
}

module.exports = SlidesSettingsPage;
