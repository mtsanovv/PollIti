sap.ui.jsview(UIComponents.POLLITI_VIEW_POLL_VOTING, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_POLL_VOTING;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_POLL_VOTING, { showHeader: false });

        this.createPageDialog(oPage);
        this.createPageLayout(oPage);

        return oPage;
    },

    createPageDialog: function(oPage) {
        const oController = this.getController();
        const oDialog = new sap.m.Dialog(UIComponents.POLL_VOTING_DIALOG, { titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });

        const oDialogMessageStrip = new sap.m.MessageStrip(UIComponents.POLL_VOTING_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.None, showIcon: true });
        oDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');

        const oDialogNavToPollsListingButton = new sap.m.Button(UIComponents.POLL_VOTING_NAV_TO_POLLS_LISTING_BUTTON, {
            text: Globals.DIALOG_RETURN_TO_POLLS_LISTING_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oDialogNavToPollsListingButton.attachPress(() => {
            oDialog.close();
            oController.navTo(Globals.NAV_POLLS_LISTING);
        });

        const oDialogContinueButton = new sap.m.Button(UIComponents.POLL_VOTING_DIALOG_CONTINUE_BUTTON, {
            text: Globals.DIALOG_CONTINUE_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oDialogContinueButton.setBusyIndicatorDelay(0)
                             .attachPress((oEvent) => {
                                 const oButton = oEvent.getSource();
                                 const sPollId = oController.getPollIdFromCurrentRouteArguments();
                                 // so that after logging back in the user is redirected back to the poll details page for the respective poll
                                 oButton.setBusy(true);
                                 oController.ajaxLogout(oButton, oDialog, [Globals.NAV_POLL, { pollId: sPollId }]);
                             });

        oDialog.addContent(oDialogMessageStrip);
        oDialog.addButton(oDialogNavToPollsListingButton);
        oDialog.addButton(oDialogContinueButton);

        oPage.addContent(oDialog);
    },

    createPageLayout: function(oPage) {
        const oGridWrapperLayout = new sap.ui.layout.Grid({ position: sap.ui.layout.GridPosition.Center, defaultIndent: 'XL4 L3 M2 S0', defaultSpan: 'XL4 L6 M8 S12' });
        const oMainLayout = new sap.ui.layout.BlockLayout(UIComponents.POLL_VOTING_PAGE_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        oGridWrapperLayout.addContent(oMainLayout);
        oPage.addContent(oGridWrapperLayout);
    },

    loadPage: function(iPollId) {
        this.resetPage();
        this.getController().pageLoaded(iPollId);
    },

    resetPage: function() {
        const oBlockLayout = sap.ui.getCore().byId(UIComponents.POLL_VOTING_PAGE_LAYOUT);
        oBlockLayout.destroyContent();
        oBlockLayout.removeAllContent();

        const oDialog = sap.ui.getCore().byId(UIComponents.POLL_VOTING_DIALOG);
        if(oDialog.isOpen()) {
            oDialog.close();
        }
    },

    fillPageLayoutAndHideControls: function() {
        const oController = this.getController();
        oController.showMainPageNav(false);

        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oLayout = sap.ui.getCore().byId(UIComponents.POLL_VOTING_PAGE_LAYOUT);

        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell( { title: oModel.getPollTitle() });

        this.fillLayoutCell(oBlockLayoutCell);

        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oLayout.addContent(oBlockLayoutRow);

        oController.setAppBusy(false);
    },

    fillLayoutCell: function(oBlockLayoutCell) {
        const oWrappingFlexBox = new sap.m.FlexBox({ direction: sap.m.FlexDirection.Column });
        this.addPollOptionsToFlexBox(oWrappingFlexBox);
        this.addSubmitButtonToFlexBox(oWrappingFlexBox);
        oBlockLayoutCell.addContent(oWrappingFlexBox);
    },

    addPollOptionsToFlexBox: function(oFlexBox) {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPollOptions = [...oModel.getPollOptions(), Globals.POLL_UNDECIDED_OPTION];
        const oRadioButtonGroup = new sap.m.RadioButtonGroup(UIComponents.POLL_VOTING_RADIO_BUTTON_GROUP, { selectedIndex: -1 })

        for(const sOption of aPollOptions) {
            const oRadioButton = new sap.m.RadioButton({ text: sOption });
            oRadioButtonGroup.addButton(oRadioButton);
        }

        oRadioButtonGroup.attachSelect(this.optionSelected);
        oFlexBox.addItem(oRadioButtonGroup);
    },

    addSubmitButtonToFlexBox: function(oFlexBox) {
        const thisView = this;
        const oSubmitButton = new sap.m.Button(UIComponents.POLL_VOTING_SUBMIT_BUTTON, { text: Globals.SUBMIT_BUTTON_TEXT, type: sap.m.ButtonType.Emphasized, width: '100%' });
        oSubmitButton.setEnabled(false)
                     .setBusyIndicatorDelay(0)
                     .attachPress((oEvent) => {
                         const oModel = thisView.getModel().getProperty(Globals.MODEL_PATH);
                         const oRadioButtonGroup = sap.ui.getCore().byId(UIComponents.POLL_VOTING_RADIO_BUTTON_GROUP);
                         oEvent.getSource().setBusy(true);
                         oModel.setSelectedOptionIndex(oRadioButtonGroup.getSelectedIndex());
                         thisView.getController().onSubmit();
                    });
        oFlexBox.addItem(oSubmitButton);
    },

    optionSelected: function() {
        const oSubmitButton = sap.ui.getCore().byId(UIComponents.POLL_VOTING_SUBMIT_BUTTON);
        if(!oSubmitButton.getEnabled()) {
            oSubmitButton.setEnabled(true);
        }
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
        const sVotingError = oModel.getVotingError();
        const oSubmitButton = sap.ui.getCore().byId(UIComponents.POLL_VOTING_SUBMIT_BUTTON);

        if(oModel.isSuccess()) {
            this.showSuccessMessage();
            oSubmitButton.setBusy(false);
        }

        if(sVotingError) {
            this.showError(sVotingError, false);
            oSubmitButton.setBusy(false);
        }

        if(oModel.getPollTitle()) {
            this.fillPageLayoutAndHideControls();
        }
    },

    showSuccessMessage: function() {
        const oDialog = sap.ui.getCore().byId(UIComponents.POLL_VOTING_DIALOG);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_VOTING_DIALOG_MESSAGE_STRIP);
        const oDialogContinueButton = sap.ui.getCore().byId(UIComponents.POLL_VOTING_DIALOG_CONTINUE_BUTTON);
        const oDialogNavToPollsListingButton = sap.ui.getCore().byId(UIComponents.POLL_VOTING_NAV_TO_POLLS_LISTING_BUTTON);

        oDialog.setTitle(Globals.SUCCESS_DIALOG_TITLE);
        oDialogMessageStrip.setType(sap.ui.core.MessageType.Success);
        oDialogMessageStrip.setText(ValidationMessages.MANUAL_VOTING_VOTE_CAST_SUCCESS);

        oDialogContinueButton.setVisible(true);
        oDialogNavToPollsListingButton.setVisible(false);

        oDialog.open();
    },

    showError: function(sMessage, bIsDuringInitialization = true) {
        const oDialog = sap.ui.getCore().byId(UIComponents.POLL_VOTING_DIALOG);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_VOTING_DIALOG_MESSAGE_STRIP);
        const oDialogContinueButton = sap.ui.getCore().byId(UIComponents.POLL_VOTING_DIALOG_CONTINUE_BUTTON);
        const oDialogNavToPollsListingButton = sap.ui.getCore().byId(UIComponents.POLL_VOTING_NAV_TO_POLLS_LISTING_BUTTON);

        oDialog.setTitle(Globals.ERROR_DIALOG_TITLE);
        oDialogMessageStrip.setType(sap.ui.core.MessageType.Error);
        oDialogMessageStrip.setText(sMessage);

        oDialogContinueButton.setVisible(!bIsDuringInitialization);
        oDialogNavToPollsListingButton.setVisible(bIsDuringInitialization);

        oDialog.open();
    }
});