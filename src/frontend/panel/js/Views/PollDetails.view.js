sap.ui.jsview(UIComponents.POLLITI_VIEW_POLL_DETAILS, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_POLL_DETAILS;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_POLL_DETAILS, { showNavButton: true, title: Globals.POLLITI_PAGE_POLL_DETAILS_NESTED_PAGE_TITLE });
        oPage.attachNavButtonPress(() => {
            oController.navToPrevious();
        });

        this.createDialog(oPage);
        this.createPageLayout(oPage);

        return oPage;
    },

    createDialog: function(oPage) {
        const thisView = this;
        const oController = this.getController();
        const oDialog = new sap.m.Dialog(UIComponents.POLL_DETAILS_DIALOG, {
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });
        oDialog.setBusyIndicatorDelay(0);

        const oDialogMessageStrip = new sap.m.MessageStrip(UIComponents.POLL_DETAILS_DIALOG_MESSAGE_STRIP, {
            type: sap.ui.core.MessageType.Warning,
            showIcon: true
        });
        oDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');

        const oDialogYesButton = new sap.m.Button(UIComponents.POLL_DETAILS_DIALOG_YES_BUTTON, {
            text: Globals.DIALOG_YES_BUTTON_TEXT,
            type: sap.m.ButtonType.Success  
        });
        oDialogYesButton.attachPress(() => {
            // when the parent function is called, oModel is not defined yet, thus we will get it when the button is pressed
            const oModel = thisView.getModel().getProperty(Globals.MODEL_PATH);
            if(oModel.isShowingPollDeletionDialog()) {
                oDialog.setBusy(true);
                oController.tryDeletePoll();
                return;
            }
            oDialog.close();
            oController.navToManualPollVotingMode();
        });

        const oDialogNoButton = new sap.m.Button(UIComponents.POLL_DETAILS_DIALOG_NO_BUTTON, {
            text: Globals.DIALOG_NO_BUTTON_TEXT,
            type: sap.m.ButtonType.Negative  
        });
        oDialogNoButton.attachPress(() => {
            oDialog.close();
        });

        const oDialogReturnToPollsListingButton = new sap.m.Button(UIComponents.POLL_DETAILS_DIALOG_NAV_TO_POLLS_LISTING_BUTTON, {
            text: Globals.DIALOG_RETURN_TO_POLLS_LISTING_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized  
        });
        oDialogReturnToPollsListingButton.attachPress(() => {
            oDialog.close();
            oController.navTo(Globals.NAV_POLLS_LISTING);
        });

        const oDialogDismissButton = new sap.m.Button(UIComponents.POLL_DETAILS_DIALOG_DISMISS_BUTTON, {
            text: Globals.DIALOG_DISMISS_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized  
        });
        oDialogDismissButton.attachPress(() => {
            oDialog.close();
        });

        oDialog.addContent(oDialogMessageStrip);
        oDialog.addButton(oDialogYesButton);
        oDialog.addButton(oDialogNoButton);
        oDialog.addButton(oDialogReturnToPollsListingButton);
        oDialog.addButton(oDialogDismissButton);

        oPage.addContent(oDialog);
    },

    createPageLayout: function(oPage) {
        const oObjectHeader = new sap.m.ObjectHeader(UIComponents.POLL_DETAILS_OBJECT_HEADER, {
            backgroundDesign: sap.m.BackgroundDesign.Translucent,
            numberUnit: Globals.POLL_ID_TITLE
        });
        oObjectHeader.setVisible(false);

        const oIconTabBar = new sap.m.IconTabBar(UIComponents.POLL_DETAILS_ICON_TAB_BAR, { expandable: false });
        oIconTabBar.addStyleClass('sapUiNoContentPadding')
                   .setVisible(false);

        const oPollDetailsFilter = new sap.m.IconTabFilter(UIComponents.POLL_DETAILS_POLL_DETAILS_FILTER, { icon: 'sap-icon://bar-chart'});
        oPollDetailsFilter.setKey(Globals.POLL_DETAILS_FILTER_KEY);

        const oPollActionsFilter = new sap.m.IconTabFilter(UIComponents.POLL_DETAILS_POLL_ACTIONS_FILTER, { icon: 'sap-icon://action' });
        oPollActionsFilter.setKey(Globals.POLL_ACTIONS_FILTER_KEY);

        oIconTabBar.addItem(oPollDetailsFilter);
        oIconTabBar.addItem(oPollActionsFilter);

        oPage.addContent(oObjectHeader);
        oPage.addContent(oIconTabBar);
    },

    loadPage: function(iPollId) {
        this.resetPage();
        this.getController().pageLoaded(iPollId);
    },

    resetPage: function() {
        const oDialog = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG);
        const oObjectHeader = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_OBJECT_HEADER);
        const oIconTabBar = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_ICON_TAB_BAR);
        const aFilterIds = [ UIComponents.POLL_DETAILS_POLL_DETAILS_FILTER, UIComponents.POLL_DETAILS_POLL_ACTIONS_FILTER ];

        if(oDialog.isBusy()) {
            oDialog.setBusy(false);
        }

        if(oDialog.isOpen()) {
            oDialog.close();
        }

        oObjectHeader.setVisible(false);
        oIconTabBar.setVisible(false);

        const oCanvasDomElement = $('#' + UIComponents.POLL_DETAILS_CHART_CANVAS);
        oCanvasDomElement.remove(); // otherwise the bar chart cannot be re-recreated

        for(const sFilterId of aFilterIds) {
            const oFilter = sap.ui.getCore().byId(sFilterId);
            const aFilterContent = oFilter.getContent();
            for(const oItem of aFilterContent) {
                oFilter.removeContent(oItem);
                oItem.destroy();
            }
        }

        oIconTabBar.setSelectedKey(Globals.POLL_DETAILS_FILTER_KEY);
    },

    fillPageLayout: function() {
        const oController = this.getController();
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oObjectHeader = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_OBJECT_HEADER);
        const oIconTabBar = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_ICON_TAB_BAR);

        oObjectHeader.setTitle(oModel.getTitle())
                     .setNumber(oModel.getId())
                     .setVisible(true);

        this.fillFilters();

        oIconTabBar.setVisible(true);

        oController.setAppBusy(false);
    },

    fillFilters: function() {
        this.fillPollDetailsFilter();
        this.fillPollActionsFilter();
    },

    fillPollDetailsFilter: function() {
        const oPollDetailsFilter = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_POLL_DETAILS_FILTER);
        this.createBarChart(oPollDetailsFilter);
        this.createPollDetailsButtons(oPollDetailsFilter);
    },

    createBarChart: function(oContainer) {
        const thisView = this;
        const oCanvasHtml = new sap.ui.core.HTML({ content: UIComponents.POLL_DETAILS_CHART_CANVAS_HTML });
        oCanvasHtml.attachAfterRendering(() => {
            if(!thisView.getModel().getProperty(Globals.MODEL_PATH).isBaseObjectModel()) {
                // sometimes this gets rerendered when the base object model is passed
                thisView.fillBarChartCanvas();
            }
        });
        oContainer.addContent(oCanvasHtml);
    },

    fillBarChartCanvas() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oCanvasDomElement = $('#' + UIComponents.POLL_DETAILS_CHART_CANVAS);

        const aLabels = oModel.getOptionsSortedByValuesDescending();
        const aBarColors = UIComponents.POLL_DETAILS_CHART_BAR_COLORS.slice(0, aLabels.length);
        const aValues = oModel.getOptionsValuesSortedDescending();

        // undecided votes are handled separately
        aLabels.push(Globals.POLL_UNDECIDED_OPTION);
        aBarColors.push(UIComponents.POLL_DETAILS_CHART_UNDECIDED_BAR_COLOR);
        aValues.push(oModel.getUndecidedVotes());

        const iTotalVotes = oModel.getTotalVotes();
        const iThreshold = oModel.getThreshold();

        try {
            new Chart(oCanvasDomElement, Globals.getPollResultsChartDefinition(aLabels, aValues, aBarColors, iTotalVotes, iThreshold));
        } catch(e) {
            console.warn(e.message);
        }
    },

    createPollDetailsButtons: function(oContainer) {
        const thisView = this;
        const oFlexBox = new sap.m.FlexBox({ justifyContent: sap.m.FlexJustifyContent.Center, wrap: sap.m.FlexWrap.Wrap });
        oFlexBox.addStyleClass('sapUiMediumMarginTopBottom');

        const oDeleteButton = new sap.m.Button({ icon: 'sap-icon://delete', text: Globals.DELETE_POLL_BUTTON_TEXT, type: sap.m.ButtonType.Negative });
        oDeleteButton.addStyleClass('sapUiSmallMarginBottom')
                     .addStyleClass('sapUiTinyMarginEnd')
                     .attachPress(() => {
                         thisView.showPollDeletionDialog();
                     });

        const oEnterTabletPollModeButton = new sap.m.Button({ text: Globals.ENTER_MANUAL_VOTING_MODE_BUTTON_TEXT, type: sap.m.ButtonType.Emphasized });
        oEnterTabletPollModeButton.attachPress(() => {
                                      thisView.showTabletPollModeWarningDialog();
                                  });

        oFlexBox.addItem(oDeleteButton);
        oFlexBox.addItem(oEnterTabletPollModeButton);

        oContainer.addContent(oFlexBox);
    },

    fillPollActionsFilter: function() {
        const oPollActionsFilter = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_POLL_ACTIONS_FILTER);
        this.createSocialSharingButtons(oPollActionsFilter);
        this.createPollInvitationSharingForm(oPollActionsFilter);
    },

    createSocialSharingButtons: function(oContainer) {
        const oController = this.getController();
        const oFlexBox = new sap.m.FlexBox({ justifyContent: sap.m.FlexJustifyContent.Center, wrap: sap.m.FlexWrap.Wrap });
        oFlexBox.addStyleClass('sapUiMediumMarginTop');
        oFlexBox.addStyleClass('sapUiLargeMarginBottom');

        const oShareToFbButton = new sap.m.Button(UIComponents.POLL_ACTIONS_SHARE_TO_FB_BUTTON, { text: Globals.SHARE_TO_FACEBOOK_BUTTON_TEXT, type: sap.m.ButtonType.Emphasized });
        oShareToFbButton.addStyleClass('sapUiSmallMarginBottom')
                        .setBusyIndicatorDelay(0)
                        .addStyleClass('sapUiTinyMarginEnd')
                        .attachPress((oEvent) => {
                            oEvent.getSource().setBusy(true);
                            oController.sharePollResultsToMetaService(true);
                        });

        const oShareToFbAndInstaButton = new sap.m.Button(UIComponents.POLL_ACTIONS_SHARE_TO_FB_AND_INSTA_BUTTON, {
            text: Globals.SHARE_TO_FACEBOOK_AND_INSTAGRAM_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oShareToFbAndInstaButton.addStyleClass('sapUiSmallMarginBottom')
                                .setBusyIndicatorDelay(0)
                                .attachPress((oEvent) => {
                                    oEvent.getSource().setBusy(true);
                                    oController.sharePollResultsToMetaService();
                                });

        oFlexBox.addItem(oShareToFbButton);
        oFlexBox.addItem(oShareToFbAndInstaButton);

        oContainer.addContent(oFlexBox);
    },

    createPollInvitationSharingForm: function(oContainer) {
        const thisView = this;
        const oController = this.getController();
        const oFlexBox = new sap.m.FlexBox({ justifyContent: sap.m.FlexJustifyContent.Center, wrap: sap.m.FlexWrap.Wrap });
        oFlexBox.addStyleClass('sapUiMediumMarginTopBottom');

        const oInputEmailAddress = new sap.m.Input(UIComponents.POLL_ACTIONS_EMAIL_ADDRESS_INPUT, { maxLength: ValidationConstants.EMAIL_INPUT_MAX_LENGTH });
        oInputEmailAddress.addStyleClass('sapUiSmallMarginBottom')
                          .addStyleClass('sapUiTinyMarginEnd')
            	          .setShowValueStateMessage(true)
                          .setRequired(true)
                          .setPlaceholder(Globals.EMAIL_ADDRESS_PLACEHOLDER)
                          .setWidth(Globals.INPUT_WIDTH)
                          .attachLiveChange(this.saveEmailAddressInput);

        const oShareViaEmailButton = new sap.m.Button(UIComponents.POLL_ACTIONS_SHARE_VIA_EMAIL_BUTTON, {
            text: Globals.SHARE_VIA_EMAIL_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oShareViaEmailButton.setBusyIndicatorDelay(0)
                            .attachPress((oEvent) => {
                                if(!thisView.validateEmailAddressInput()) {
                                    return;
                                }
                                oEvent.getSource().setBusy(true);
                                oController.sharePollInvitationViaEmail();
                            });

        oFlexBox.addItem(oInputEmailAddress);
        oFlexBox.addItem(oShareViaEmailButton);

        oContainer.addContent(oFlexBox);
    },

    saveEmailAddressInput: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_POLL_DETAILS);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const sEmailAddressInputValue = sap.ui.getCore().byId(UIComponents.POLL_ACTIONS_EMAIL_ADDRESS_INPUT).getValue();

        oModel.setEmailAddress(sEmailAddressInputValue);
        oLoginPageView.validateEmailAddressInput();
    },

    validateEmailAddressInput: function() {
        const oInput = sap.ui.getCore().byId(UIComponents.POLL_ACTIONS_EMAIL_ADDRESS_INPUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sEmailAddressFieldError = oModel.getEmailAddressFieldError();

        if(sEmailAddressFieldError) {
            oInput.setValueStateText(sEmailAddressFieldError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    showSharingError: function(sMessage) {
        const aButtonIds = [UIComponents.POLL_ACTIONS_SHARE_TO_FB_BUTTON, UIComponents.POLL_ACTIONS_SHARE_TO_FB_AND_INSTA_BUTTON, UIComponents.POLL_ACTIONS_SHARE_VIA_EMAIL_BUTTON];
        for(const sButtonId of aButtonIds) {
            const oButton = sap.ui.getCore().byId(sButtonId);
            oButton.setBusy(false);
        }

        this.showError(sMessage, false);
    },

    showError: function(sMessage, bIsFatal = true) {
        const oDialog = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_MESSAGE_STRIP);
        const oDialogYesButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_YES_BUTTON);
        const oDialogNoButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_NO_BUTTON);
        const oDialogNavToPollsListingButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_NAV_TO_POLLS_LISTING_BUTTON);
        const oDialogDismissButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_DISMISS_BUTTON);

        oDialog.setTitle(Globals.ERROR_DIALOG_TITLE);
        oDialogMessageStrip.setType(sap.ui.core.MessageType.Error);
        oDialogMessageStrip.setText(sMessage);

        oDialogYesButton.setVisible(false);
        oDialogNoButton.setVisible(false);
        oDialogNavToPollsListingButton.setVisible(bIsFatal);
        oDialogDismissButton.setVisible(!bIsFatal);

        if(oDialog.isBusy()) {
            oDialog.setBusy(false);
        }

        if(!oDialog.isOpen()) {
            oDialog.open();
        }
    },

    showPollDeletionDialog: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oDialog = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_MESSAGE_STRIP);
        const oDialogYesButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_YES_BUTTON);
        const oDialogNoButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_NO_BUTTON);
        const oDialogNavToPollsListingButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_NAV_TO_POLLS_LISTING_BUTTON);
        const oDialogDismissButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_DISMISS_BUTTON);

        oDialog.setTitle(Globals.POLL_DELETION_DIALOG_TITLE);
        oDialogMessageStrip.setType(sap.ui.core.MessageType.Warning);
        oDialogMessageStrip.setText(Globals.POLL_DELETION_WARNING);

        oDialogYesButton.setVisible(true);
        oDialogNoButton.setVisible(true);
        oDialogNavToPollsListingButton.setVisible(false);
        oDialogDismissButton.setVisible(false);

        oModel.setIsShowingPollDeletionDialog(true);
        oDialog.open();
    },

    showTabletPollModeWarningDialog: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oDialog = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_MESSAGE_STRIP);
        const oDialogYesButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_YES_BUTTON);
        const oDialogNoButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_NO_BUTTON);
        const oDialogNavToPollsListingButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_NAV_TO_POLLS_LISTING_BUTTON);
        const oDialogDismissButton = sap.ui.getCore().byId(UIComponents.POLL_DETAILS_DIALOG_DISMISS_BUTTON);

        oDialog.setTitle(Globals.POLL_MANUAL_VOTING_DIALOG_TITLE);
        oDialogMessageStrip.setType(sap.ui.core.MessageType.Warning);
        oDialogMessageStrip.setText(Globals.POLL_MANUAL_VOTING_WARNING);

        oDialogYesButton.setVisible(true);
        oDialogNoButton.setVisible(true);
        oDialogNavToPollsListingButton.setVisible(false);
        oDialogDismissButton.setVisible(false);

        oModel.setIsShowingPollDeletionDialog(false);
        oDialog.open();
    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        this.applyBasicObjectModel();
        if(!oModel.isBaseObjectModel()) {
            this.applyViewSpecificObjectModel();
        }
    },

    applyBasicObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();

        if(sMessage) {
            this.showError(sMessage);
        }
    },

    applyViewSpecificObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oShareToFbButton = sap.ui.getCore().byId(UIComponents.POLL_ACTIONS_SHARE_TO_FB_BUTTON);
        const oShareToFbAndInstaButton = sap.ui.getCore().byId(UIComponents.POLL_ACTIONS_SHARE_TO_FB_AND_INSTA_BUTTON);
        const sSharingError = oModel.getSharingError();

        if(sSharingError) {
            this.showSharingError(sSharingError);
        }

        if(oModel.isFacebookSharingSuccessful()) {
            this.disableSocialSharingButtonAfterSuccess(oShareToFbButton);
        }

        if(oModel.isFacebookAndInstagramSharingSuccessful()) {
            const aButtons = [oShareToFbButton, oShareToFbAndInstaButton];
            for(const oButton of aButtons) {
                this.disableSocialSharingButtonAfterSuccess(oButton);
            }
        }

        if(oModel.isSharingViaEmailSuccessful()) {
            this.pollInvitationSharingAfterSuccess();
        }

        if(oModel.getId()) {
            // we've got the poll initial information
            this.fillPageLayout();
        }
    },

    pollInvitationSharingAfterSuccess: function() {
        const oShareViaEmailButton = sap.ui.getCore().byId(UIComponents.POLL_ACTIONS_SHARE_VIA_EMAIL_BUTTON);
        const oEmailAddressInput = sap.ui.getCore().byId(UIComponents.POLL_ACTIONS_EMAIL_ADDRESS_INPUT);
    
        oShareViaEmailButton.setBusy(false);
        oEmailAddressInput.setValueStateText(ValidationMessages.INVITATION_SENT_SUCCESSFULLY);
        oEmailAddressInput.setValueState(sap.ui.core.ValueState.Information);
    },

    disableSocialSharingButtonAfterSuccess: function(oButton) {
        oButton.setBusy(false);
        oButton.setEnabled(false);
        oButton.setType(sap.m.ButtonType.Success);
    }
});