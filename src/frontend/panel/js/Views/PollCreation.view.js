sap.ui.jsview(UIComponents.POLLITI_VIEW_POLL_CREATION, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_POLL_CREATION;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_POLL_CREATION, { title: Globals.POLLITI_PAGE_CREATE_POLL_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => {
            oController.navToPrevious();
        });

        this.createErrorDialog(oPage);

        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog(UIComponents.POLL_CREATION_ERROR_DIALOG, {
            title: Globals.ERROR_DIALOG_TITLE,
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });

        const oErrorDialogMessageStrip = new sap.m.MessageStrip(UIComponents.POLL_CREATION_ERROR_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.Error, showIcon: true });
        oErrorDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');

        const oErrorDialogNavToLaunchpadButton = new sap.m.Button(UIComponents.POLL_CREATION_ERROR_DIALOG_NAV_TO_LAUNCHPAD_BUTTON, {
            text: Globals.DIALOG_CONTINUE_TO_LAUNCHPAD_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oErrorDialogNavToLaunchpadButton.attachPress(() => {
            oErrorDialog.close();
            oController.navTo(Globals.NAV_LAUNCHPAD);
        });

        const oErrorDialogDismissButton = new sap.m.Button(UIComponents.POLL_CREATION_ERROR_DIALOG_DISMISS_BUTTON, {
            text: Globals.DIALOG_DISMISS_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oErrorDialogDismissButton.attachPress(() => {
            oErrorDialog.close();
        });

        oErrorDialog.addContent(oErrorDialogMessageStrip);
        oErrorDialog.addButton(oErrorDialogNavToLaunchpadButton);
        oErrorDialog.addButton(oErrorDialogDismissButton);
        oPage.addContent(oErrorDialog);
    },

    loadPage: function() {
        this.resetPage();
    },

    resetPage: function() {
        const oModel = new PollCreationObjectModel();

        this.setObjectModel(oModel);
        this.recreatePageLayout();
    },

    recreatePageLayout: async function() {
        const oPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_POLL_CREATION);
        const oPageBlockLayout = sap.ui.getCore().byId(UIComponents.POLL_CREATION_BLOCK_LAYOUT);
        const oController = this.getController();

        if(oPageBlockLayout) {
            oPage.removeContent(oPageBlockLayout);
            oPageBlockLayout.destroy();
        }
        this.createForm(oPage);

        oController.setAppBusy(false);
    },

    createForm: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout(UIComponents.POLL_CREATION_BLOCK_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell({ title: Globals.POLL_CREATION_FORM_TITLE, titleAlignment: sap.ui.core.HorizontalAlign.Center });

        this.fillFormBlockLayoutCell(oBlockLayoutCell);

        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oBlockLayout.addContent(oBlockLayoutRow);
        oPage.addContent(oBlockLayout);
    },

    fillFormBlockLayoutCell: function(oBlockLayoutCell) {
        const oWrappingFlexBox = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column });
        const oFieldsWrappingFlexBox = new sap.m.FlexBox(UIComponents.POLL_CREATION_FORM_FIELDS_WRAPPER_FLEXBOX, {
            alignItems: sap.m.FlexAlignItems.Center,
            direction: sap.m.FlexDirection.Column
        });

        this.createSuccessMessageStrip(oWrappingFlexBox);
        this.createFieldsAndSubmitButton(oFieldsWrappingFlexBox);

        oWrappingFlexBox.addItem(oFieldsWrappingFlexBox);
        oBlockLayoutCell.addContent(oWrappingFlexBox);
    },

    createFieldsAndSubmitButton: function(oFieldsWrappingFlexBox) {
        this.createPollTitleInput(oFieldsWrappingFlexBox);
        this.createThresholdInput(oFieldsWrappingFlexBox);
        this.createOptionsInputs(oFieldsWrappingFlexBox);
        this.createAddRemoveOptionsButtons(oFieldsWrappingFlexBox);
        this.createSubmitButton(oFieldsWrappingFlexBox);
    },

    createPollTitleInput: function(oWrappingFlexBox) {
        const oInputUsername = new sap.m.Input(UIComponents.POLL_CREATION_FORM_POLL_TITLE_INPUT, { maxLength: ValidationConstants.POLL_TITLE_INPUT_MAX_LENGTH });
        oInputUsername.addStyleClass('sapUiSmallMarginBottom')
            	      .setShowValueStateMessage(true)
                      .setRequired(true)
                      .setPlaceholder(Globals.POLL_TITLE_INPUT_PLACEHOLDER)
                      .setWidth(Globals.INPUT_WIDTH)
                      .attachLiveChange(this.savePollTitleInput);

        oWrappingFlexBox.addItem(oInputUsername);
    },

    savePollTitleInput: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_POLL_CREATION);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const sPollTitleInputValue = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_POLL_TITLE_INPUT).getValue();

        oModel.setTitle(sPollTitleInputValue);
        oLoginPageView.validatePollTitleInput();
    },

    validatePollTitleInput: function() {
        const oInput = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_POLL_TITLE_INPUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sPollTitleFieldError = oModel.getTitleFieldError();

        if(sPollTitleFieldError) {
            oInput.setValueStateText(sPollTitleFieldError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    createThresholdInput: function(oWrappingFlexBox) {
        // setting the input type to Number is absolutely pointless - our live change listener validation doesn't even get triggered if it is not a valid number
        const oInputThreshold = new sap.m.Input(UIComponents.POLL_CREATION_FORM_THRESHOLD_INPUT);
        oInputThreshold.addStyleClass('sapUiSmallMarginBottom')
            	       .setShowValueStateMessage(true)
                       .setPlaceholder(Globals.THRESHOLD_INPUT_PLACEHOLDER)
                       .setWidth(Globals.INPUT_WIDTH)
                       .attachLiveChange(this.saveThresholdInput);

        oWrappingFlexBox.addItem(oInputThreshold);
    },

    saveThresholdInput: function() {
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_POLL_CREATION);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const sThresholdInputValue = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_THRESHOLD_INPUT).getValue();

        oModel.setThreshold(sThresholdInputValue);
        oLoginPageView.validateThresholdInput();
    },

    validateThresholdInput: function() {
        const oInput = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_THRESHOLD_INPUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sThresholdFieldError = oModel.getThresholdFieldError();

        if(sThresholdFieldError) {
            oInput.setValueStateText(sThresholdFieldError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    createOptionsInputs: function(oWrappingFlexBox) {
        const oFlexBoxOptionsWrapper = new sap.m.FlexBox(UIComponents.POLL_CREATION_FORM_OPTIONS_WRAPPER_FLEXBOX, {
            alignItems: sap.m.FlexAlignItems.Center,
            direction: sap.m.FlexDirection.Column
        });
        for(let i = 0; i < ValidationConstants.POLL_OPTIONS_MIN_COUNT; i++) {
            this.createOptionInput(oFlexBoxOptionsWrapper);
        }
        oWrappingFlexBox.addItem(oFlexBoxOptionsWrapper);
    },

    createOptionInput(oWrappingFlexBox) {
        const iOptionConsecutiveNumber = oWrappingFlexBox.getItems().length;
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oOptionInput = new sap.m.Input({ maxLength: ValidationConstants.POLL_TITLE_INPUT_MAX_LENGTH });
        oOptionInput.addStyleClass('sapUiSmallMarginBottom')
            	    .setShowValueStateMessage(true)
                    .setRequired(true)
                    .setPlaceholder(Globals.POLL_OPTION_INPUT_PREFIX_PLACEHOLDER + (iOptionConsecutiveNumber + 1))
                    .setWidth(Globals.INPUT_WIDTH)
                    .attachLiveChange(this.saveOptionInput);
        oModel.setOptionAt(iOptionConsecutiveNumber, '');
        oWrappingFlexBox.addItem(oOptionInput);
    },

    saveOptionInput(oLiveChangeEvent) {
         // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_POLL_CREATION);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const oInput = oLiveChangeEvent.getSource();
        const oFlexBoxOptionsWrapper = oInput.getParent();
        const iOptionConsecutiveNumber = oFlexBoxOptionsWrapper.getItems().indexOf(oInput);

        oModel.setOptionAt(iOptionConsecutiveNumber, oInput.getValue());
        oLoginPageView.validateOptionInput(oInput, iOptionConsecutiveNumber);
    },

    validateOptionInput: function(oInput, iOptionConsecutiveNumber) {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sOptionError = oModel.getOptionFieldErrorAt(iOptionConsecutiveNumber);

        if(sOptionError) {
            oInput.setValueStateText(sOptionError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    validateOptionsInputs: function() {
        const oFlexBoxOptionsWrapper = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_OPTIONS_WRAPPER_FLEXBOX);
        const aOptionInputs = oFlexBoxOptionsWrapper.getItems();
        let bAreAllOptionsValid = true;

        for(let i = 0; i < aOptionInputs.length; i++) {
            bAreAllOptionsValid = this.validateOptionInput(aOptionInputs[i], i) && bAreAllOptionsValid;
        }

        return bAreAllOptionsValid;
    },

    createAddRemoveOptionsButtons: function(oWrappingFlexBox) {
        const thisView = this;
        const oFlexBoxOptionsWrapper = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_OPTIONS_WRAPPER_FLEXBOX);

        const oFlexBoxAddRemoveOptionsButtonsWrapper = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Row});
        oFlexBoxAddRemoveOptionsButtonsWrapper.addStyleClass('sapUiSmallMarginBottom');

        const oAddOptionButton = new sap.m.Button({ icon: 'sap-icon://add', text: Globals.ADD_OPTION_BUTTON_TEXT });
        oAddOptionButton.addStyleClass('sapUiTinyMarginEnd')
                        .attachPress(() => {
                            thisView.createOptionInput(oFlexBoxOptionsWrapper);
                            if(oFlexBoxOptionsWrapper.getItems().length == ValidationConstants.POLL_OPTIONS_MAX_COUNT) {
                                oAddOptionButton.setEnabled(false);
                            }

                            if(oFlexBoxOptionsWrapper.getItems().length > ValidationConstants.POLL_OPTIONS_MIN_COUNT) {
                                oRemoveOptionButton.setEnabled(true);
                            }
                        });

        const oRemoveOptionButton = new sap.m.Button({ icon: 'sap-icon://less', text: Globals.REMOVE_OPTION_BUTTON_TEXT });
        oRemoveOptionButton.setEnabled(false)
                           .attachPress(() => {
                               thisView.removeLastOptionInput();
                               if(oFlexBoxOptionsWrapper.getItems().length < ValidationConstants.POLL_OPTIONS_MAX_COUNT) {
                                   oAddOptionButton.setEnabled(true);
                               }

                               if(oFlexBoxOptionsWrapper.getItems().length == ValidationConstants.POLL_OPTIONS_MIN_COUNT) {
                                   oRemoveOptionButton.setEnabled(false);
                               }
                           });

        oFlexBoxAddRemoveOptionsButtonsWrapper.addItem(oAddOptionButton);
        oFlexBoxAddRemoveOptionsButtonsWrapper.addItem(oRemoveOptionButton);

        oWrappingFlexBox.addItem(oFlexBoxAddRemoveOptionsButtonsWrapper);
    },

    removeLastOptionInput: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oFlexBoxOptionsWrapper = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_OPTIONS_WRAPPER_FLEXBOX);
        const aOptionInputs = oFlexBoxOptionsWrapper.getItems();
        const iLastOptionConsecutiveNumber = aOptionInputs.length - 1;
        const oLastOptionInput = aOptionInputs[iLastOptionConsecutiveNumber];

        oFlexBoxOptionsWrapper.removeItem(oLastOptionInput);
        oModel.removeOptionAt(iLastOptionConsecutiveNumber);
        oLastOptionInput.destroy();
    },

    createSuccessMessageStrip: function(oWrappingFlexBox) {
        const oSuccessMessageStrip = new sap.m.MessageStrip(UIComponents.POLL_CREATION_SUCCESS_MESSAGE_STRIP, {
            showIcon: true,
            showCloseButton: true,
            type: sap.ui.core.MessageType.Success
        });
        oSuccessMessageStrip.addStyleClass('sapUiMediumMarginBottom')
                            .setVisible(false);

        oWrappingFlexBox.addItem(oSuccessMessageStrip);
    },

    createSubmitButton: function(oWrappingFlexBox) {
        const thisView = this;
        const oController = this.getController();
        const oSubmitButton = new sap.m.Button(UIComponents.POLL_CREATION_FORM_SUBMIT_BUTTON, { type: sap.m.ButtonType.Emphasized, text: Globals.SUBMIT_BUTTON_TEXT });
        oSubmitButton.setBusyIndicatorDelay(0)
                     .attachPress((oEvent) => {
                         if(!thisView.validateInputs()) {
                            return;
                         }
                         oEvent.getSource().setBusy(true);
                         oController.submitPoll();
                     });
        oWrappingFlexBox.addItem(oSubmitButton);
    },

    validateInputs: function() {
        let bAreAllInputsOkay = true;
        const aInputsValidityValues = [ this.validatePollTitleInput(), this.validateThresholdInput(), this.validateOptionsInputs() ];
        for(const bInputValid of aInputsValidityValues) {
            bAreAllInputsOkay = bInputValid && bAreAllInputsOkay;
        }

        return bAreAllInputsOkay;
    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);

        if(oModel.getId()) {
            this.handleSuccess();
            return;
        }

        this.handleFailure();
    },

    handleFailure: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();
        const oErrorDialog = sap.ui.getCore().byId(UIComponents.POLL_CREATION_ERROR_DIALOG);
        const oErrorDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_CREATION_ERROR_DIALOG_MESSAGE_STRIP);
        const oSubmitButton = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_SUBMIT_BUTTON);

        oSubmitButton.setBusy(false);
        oErrorDialogMessageStrip.setText(sMessage);
        this.hideIrrelevantButtonsFromErrorDialog();
        oErrorDialog.open();
    },

    hideIrrelevantButtonsFromErrorDialog: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oErrorDialogDismissButton = sap.ui.getCore().byId(UIComponents.POLL_CREATION_ERROR_DIALOG_DISMISS_BUTTON);
        const oErrorDialogContinueToLaunchpadButton = sap.ui.getCore().byId(UIComponents.POLL_CREATION_ERROR_DIALOG_NAV_TO_LAUNCHPAD_BUTTON);

        const bShouldShowDismissButton = oModel.isErrorMessageDismissable();

        oErrorDialogDismissButton.setVisible(bShouldShowDismissButton);
        oErrorDialogContinueToLaunchpadButton.setVisible(!bShouldShowDismissButton);
    },

    handleSuccess: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sSuccessMessage = "Poll #" + oModel.getId() + " created successfully";
        this.showSuccessMessageInStrip(sSuccessMessage);

        const oFieldsWrapper = sap.ui.getCore().byId(UIComponents.POLL_CREATION_FORM_FIELDS_WRAPPER_FLEXBOX);
        oFieldsWrapper.destroyItems();
        oFieldsWrapper.removeAllItems();
        this.setObjectModel(new PollCreationObjectModel()); // reset the object model so that we start anew
        this.createFieldsAndSubmitButton(oFieldsWrapper);
    },

    showSuccessMessageInStrip: function(sMessage) {
        const oSuccessMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_CREATION_SUCCESS_MESSAGE_STRIP);
        oSuccessMessageStrip.setText(sMessage);
        oSuccessMessageStrip.setVisible(true);
    },

    setObjectModel: function(oObjectModel) {
        const oModel = {
            [Globals.MODEL_PATH_KEY]: oObjectModel
        };
        this.setModel(new sap.ui.model.json.JSONModel(oModel));
    }
});