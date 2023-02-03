sap.ui.jsview(UIComponents.POLLITI_VIEW_USER_EDITOR, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_USER_EDITOR;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_USER_EDITOR, { showNavButton: true });
        oPage.attachNavButtonPress(() => {
            oController.navToPrevious();
        });

        this.createErrorDialog(oPage);

        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog(UIComponents.USER_EDITOR_ERROR_DIALOG, {
            title: Globals.ERROR_DIALOG_TITLE,
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });

        const oErrorDialogMessageStrip = new sap.m.MessageStrip(UIComponents.USER_EDITOR_ERROR_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.Error, showIcon: true });
        oErrorDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');

        const oErrorDialogNavToLaunchpadButton = new sap.m.Button(UIComponents.USER_EDITOR_ERROR_DIALOG_NAV_TO_LAUNCHPAD_BUTTON, {
            text: Globals.DIALOG_CONTINUE_TO_LAUNCHPAD_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oErrorDialogNavToLaunchpadButton.attachPress(() => {
            oErrorDialog.close();
            oController.navTo(Globals.NAV_LAUNCHPAD);
        });

        const oErrorDialogNavToUsersListingButton = new sap.m.Button(UIComponents.USER_EDITOR_ERROR_DIALOG_NAV_TO_USERS_LISTING_BUTTON, {
            text: Globals.DIALOG_RETURN_TO_USERS_LISTING_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oErrorDialogNavToUsersListingButton.attachPress(() => {
            oErrorDialog.close();
            oController.navTo(Globals.NAV_USERS_LISTING);
        });

        const oErrorDialogDismissButton = new sap.m.Button(UIComponents.USER_EDITOR_ERROR_DIALOG_DISMISS_BUTTON, {
            text: Globals.DIALOG_DISMISS_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized
        });
        oErrorDialogDismissButton.attachPress(() => {
            oErrorDialog.close();
        });

        oErrorDialog.addContent(oErrorDialogMessageStrip);
        oErrorDialog.addButton(oErrorDialogNavToLaunchpadButton);
        oErrorDialog.addButton(oErrorDialogNavToUsersListingButton);
        oErrorDialog.addButton(oErrorDialogDismissButton);
        oPage.addContent(oErrorDialog);
    },

    loadPage: function(sUserToEdit) {
        this.resetPage(sUserToEdit);
        this.getController().pageLoaded();
    },

    resetPage: function(sUserToEdit) {
        const oModel = new UserEditorObjectModel();

        if(sUserToEdit) {
            oModel.setIsUserUpdate(true);
            oModel.setInitialUsername(sUserToEdit);
        }

        this.setObjectModel(oModel);
        this.recreatePageLayout();
    },

    recreatePageLayout: async function() {
        const oPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_USER_EDITOR);
        const oPageBlockLayout = sap.ui.getCore().byId(UIComponents.USER_EDITOR_BLOCK_LAYOUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oController = this.getController();

        if(oPageBlockLayout) {
            oPage.removeContent(oPageBlockLayout);
            oPageBlockLayout.destroy();
        }
        this.createForm(oPage);

        if(!oModel.isUserUpdate()) {
            oController.setAppBusy(false);
        }
    },

    createForm: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout(UIComponents.USER_EDITOR_BLOCK_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell({ title: Globals.USER_EDITOR_FORM_TITLE, titleAlignment: sap.ui.core.HorizontalAlign.Center });

        this.fillFormBlockLayoutCell(oBlockLayoutCell);

        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oBlockLayout.addContent(oBlockLayoutRow);
        oPage.addContent(oBlockLayout);
    },

    fillFormBlockLayoutCell: function(oBlockLayoutCell) {
        const oWrappingFlexBox = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column });
        const oFieldsWrappingFlexBox = new sap.m.FlexBox(UIComponents.USER_EDITOR_FORM_FIELDS_WRAPPER_FLEXBOX, {
            alignItems: sap.m.FlexAlignItems.Center,
            direction: sap.m.FlexDirection.Column
        });

        this.createSuccessMessageStrip(oWrappingFlexBox);
        this.createFieldsAndSubmitButton(oFieldsWrappingFlexBox);

        oWrappingFlexBox.addItem(oFieldsWrappingFlexBox);
        oBlockLayoutCell.addContent(oWrappingFlexBox);
    },

    createFieldsAndSubmitButton: function(oFieldsWrappingFlexBox) {
        this.createUsernameInput(oFieldsWrappingFlexBox);
        this.createDisplayNameInput(oFieldsWrappingFlexBox);
        this.createPasswordInput(oFieldsWrappingFlexBox);
        this.createPasswordConfirmationInput(oFieldsWrappingFlexBox);
        this.createEnabledInput(oFieldsWrappingFlexBox);
        this.createSubmitButton(oFieldsWrappingFlexBox);
    },

    createSuccessMessageStrip: function(oWrappingFlexBox) {
        const oSuccessMessageStrip = new sap.m.MessageStrip(UIComponents.USER_EDITOR_SUCCESS_MESSAGE_STRIP, {
            showIcon: true,
            showCloseButton: true,
            type: sap.ui.core.MessageType.Success
        });
        oSuccessMessageStrip.addStyleClass('sapUiMediumMarginBottom')
                            .setVisible(false);

        oWrappingFlexBox.addItem(oSuccessMessageStrip);
    },

    createUsernameInput: function(oWrappingFlexBox) {
        const oInputUsername = new sap.m.Input(UIComponents.USER_EDITOR_FORM_USERNAME_INPUT, { maxLength: ValidationConstants.USERNAME_INPUT_MAX_LENGTH });
        oInputUsername.addStyleClass('sapUiSmallMarginBottom')
            	      .setShowValueStateMessage(true)
                      .setRequired(true)
                      .setPlaceholder(Globals.USERNAME_INPUT_PLACEHOLDER)
                      .setWidth(Globals.INPUT_WIDTH)
                      .attachLiveChange(this.saveUsernameInput);

        oWrappingFlexBox.addItem(oInputUsername);
    },

    saveUsernameInput: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_USER_EDITOR);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const sUsernameInputValue = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_USERNAME_INPUT).getValue();

        oModel.setUsername(sUsernameInputValue);
        oLoginPageView.validateUsernameInput();
    },

    validateUsernameInput: function() {
        const oInput = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_USERNAME_INPUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sUsernameFieldError = oModel.getUsernameFieldError();

        if(sUsernameFieldError) {
            oInput.setValueStateText(sUsernameFieldError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    createDisplayNameInput: function(oWrappingFlexBox) {
        const oInputDisplayName = new sap.m.Input(UIComponents.USER_EDITOR_FORM_DISPLAY_NAME_INPUT, { maxLength: ValidationConstants.DISPLAY_NAME_INPUT_MAX_LENGTH });
        oInputDisplayName.addStyleClass('sapUiSmallMarginBottom')
            	         .setShowValueStateMessage(true)
                         .setRequired(true)
                         .setPlaceholder(Globals.DISPLAY_NAME_INPUT_PLACEHOLDER)
                         .setWidth(Globals.INPUT_WIDTH)
                         .attachLiveChange(this.saveDisplayNameInput);

        oWrappingFlexBox.addItem(oInputDisplayName);
    },

    saveDisplayNameInput: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_USER_EDITOR);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const sDisplayNameInputValue = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_DISPLAY_NAME_INPUT).getValue();

        oModel.setDisplayName(sDisplayNameInputValue);
        oLoginPageView.validateDisplayNameInput();
    },

    validateDisplayNameInput: function() {
        const oInput = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_DISPLAY_NAME_INPUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sDisplayNameFieldError = oModel.getDisplayNameFieldError();

        if(sDisplayNameFieldError) {
            oInput.setValueStateText(sDisplayNameFieldError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    createPasswordInput: function(oWrappingFlexBox) {
        const oInputPassword = new sap.m.Input(UIComponents.USER_EDITOR_FORM_PASSWORD_INPUT, {
            maxLength: ValidationConstants.PASSWORD_INPUT_MAX_LENGTH,
            type: sap.m.InputType.Password
        });
        oInputPassword.addStyleClass('sapUiSmallMarginBottom')
            	      .setShowValueStateMessage(true)
                      .setRequired(true)
                      .setPlaceholder(this.getPasswordInputPlaceholderText())
                      .setWidth(Globals.INPUT_WIDTH)
                      .attachLiveChange(this.savePasswordInput);

        oWrappingFlexBox.addItem(oInputPassword);
    },

    getPasswordInputPlaceholderText: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        if(oModel.isUserUpdate()) {
            return Globals.UPDATE_AGENT_PASSWORD_INPUT_PLACEHOLDER;
        }
        return Globals.PASSWORD_INPUT_PLACEHOLDER;
    },

    savePasswordInput: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_USER_EDITOR);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const sPasswordInputValue = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_PASSWORD_INPUT).getValue();

        oModel.setPassword(sPasswordInputValue);
        oLoginPageView.validatePasswordInput();
        oLoginPageView.validatePasswordConfirmationInput();
    },

    validatePasswordInput: function() {
        const oInput = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_PASSWORD_INPUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sPasswordFieldError = oModel.getPasswordFieldError();

        if(sPasswordFieldError) {
            oInput.setValueStateText(sPasswordFieldError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    createPasswordConfirmationInput: function(oWrappingFlexBox) {
        const oInputPasswordConfirmation = new sap.m.Input(UIComponents.USER_EDITOR_FORM_PASSWORD_CONFIRMATION_INPUT, {
            maxLength: ValidationConstants.PASSWORD_INPUT_MAX_LENGTH,
            type: sap.m.InputType.Password
        });
        oInputPasswordConfirmation.addStyleClass('sapUiSmallMarginBottom')
            	      .setShowValueStateMessage(true)
                      .setRequired(true)
                      .setPlaceholder(this.getPasswordConfirmationInputPlaceholderText())
                      .setWidth(Globals.INPUT_WIDTH)
                      .attachLiveChange(this.savePasswordConfirmationInput);

        oWrappingFlexBox.addItem(oInputPasswordConfirmation);
    },

    getPasswordConfirmationInputPlaceholderText: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        if(oModel.isUserUpdate()) {
            return Globals.UPDATE_AGENT_PASSWORD_CONFIRMATION_INPUT_PLACEHOLDER;
        }
        return Globals.PASSWORD_CONFIRMATION_INPUT_PLACEHOLDER;
    },

    savePasswordConfirmationInput: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_USER_EDITOR);
        const oModel = oLoginPageView.getModel().getProperty(Globals.MODEL_PATH);
        const sPasswordConfirmationInputValue = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_PASSWORD_CONFIRMATION_INPUT).getValue();

        oModel.setPasswordConfirmation(sPasswordConfirmationInputValue);
        oLoginPageView.validatePasswordConfirmationInput();
    },

    validatePasswordConfirmationInput: function() {
        const oInput = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_PASSWORD_CONFIRMATION_INPUT);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sPasswordConfirmationFieldError = oModel.getPasswordConfirmationFieldError();

        if(sPasswordConfirmationFieldError) {
            oInput.setValueStateText(sPasswordConfirmationFieldError);
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
        return true;
    },

    createEnabledInput: function(oWrappingFlexBox) {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oEnabledCheckbox = new sap.m.CheckBox(UIComponents.USER_EDITOR_FORM_CHECKBOX_INPUT, { selected: oModel.isAgentAccountEnabled(), text: Globals.ENABLED_TITLE });
        oEnabledCheckbox.attachSelect((oEvent) => {
            oModel.setAgentAccountEnabled(oEvent.getParameters().selected);
        });
        oWrappingFlexBox.addItem(oEnabledCheckbox);
    },

    createSubmitButton: function(oWrappingFlexBox) {
        const thisView = this;
        const oController = this.getController();
        const oSubmitButton = new sap.m.Button(UIComponents.USER_EDITOR_FORM_SUBMIT_BUTTON, { type: sap.m.ButtonType.Emphasized, text: Globals.SUBMIT_BUTTON_TEXT });
        oSubmitButton.setBusyIndicatorDelay(0)
                     .attachPress((oEvent) => {
                         if(!thisView.validateInputs()) {
                            return;
                         }
                         oEvent.getSource().setBusy(true);
                         oController.submitAgentDetails();
                     });
        oWrappingFlexBox.addItem(oSubmitButton);
    },

    validateInputs: function() {
        let bAreAllInputsOkay = true;
        const aInputsValidityValues = [ this.validateUsernameInput(), this.validateDisplayNameInput(), this.validatePasswordInput(), this.validatePasswordConfirmationInput() ];
        for(const bInputValid of aInputsValidityValues) {
            bAreAllInputsOkay &&= bInputValid;
        }

        return bAreAllInputsOkay;
    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        // in the update agent case, after we initially fetch the user's data successfully, the submission is not successful (yet) so isSuccess will be false
        // however, there will be no error message because everything is going as intended
        // in this case, only fill the form fields
        if(oModel.isUserUpdate() && !oModel.isSuccess() && !oModel.getMessage()) {
            this.fillFormFieldsWithAgentDetails();
            return;
        }

        if(!oModel.isSuccess()) {
            this.handleFailure();
            return;
        }

        this.handleSuccess();
    },

    fillFormFieldsWithAgentDetails: function() {
        const oController = this.getController();
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oUsernameField = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_USERNAME_INPUT);
        const oDisplayNameField = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_DISPLAY_NAME_INPUT);
        const oEnabledCheckbox = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_CHECKBOX_INPUT);

        oUsernameField.setValue(oModel.getUsername());
        oDisplayNameField.setValue(oModel.getDisplayName());
        oEnabledCheckbox.setSelected(oModel.isAgentAccountEnabled());
        oController.setAppBusy(false);
    },

    handleFailure: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();
        const oErrorDialog = sap.ui.getCore().byId(UIComponents.USER_EDITOR_ERROR_DIALOG);
        const oErrorDialogMessageStrip = sap.ui.getCore().byId(UIComponents.USER_EDITOR_ERROR_DIALOG_MESSAGE_STRIP);

        oErrorDialogMessageStrip.setText(sMessage);
        this.hideIrrelevantButtonsFromErrorDialog();
        oErrorDialog.open();
    },

    hideIrrelevantButtonsFromErrorDialog: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oErrorDialogDismissButton = sap.ui.getCore().byId(UIComponents.USER_EDITOR_ERROR_DIALOG_DISMISS_BUTTON);
        const oErrorDialogContinueToLaunchpadButton = sap.ui.getCore().byId(UIComponents.USER_EDITOR_ERROR_DIALOG_NAV_TO_LAUNCHPAD_BUTTON);
        const oErrorDialogContinueToUsersListingButton = sap.ui.getCore().byId(UIComponents.USER_EDITOR_ERROR_DIALOG_NAV_TO_USERS_LISTING_BUTTON);

        const bIsUserUpdatePage = oModel.isUserUpdate();
        const bShouldShowDismissButton = oModel.isErrorMessageDismissable();
        const bShouldShowContinueToLaunchpadButton = !bShouldShowDismissButton && !bIsUserUpdatePage;
        const bShouldShowReturnToUsersListingButton = !bShouldShowDismissButton && bIsUserUpdatePage;

        oErrorDialogDismissButton.setVisible(bShouldShowDismissButton);
        oErrorDialogContinueToLaunchpadButton.setVisible(bShouldShowContinueToLaunchpadButton);
        oErrorDialogContinueToUsersListingButton.setVisible(bShouldShowReturnToUsersListingButton);
    },

    handleSuccess: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        if(!oModel.isUserUpdate()) {
            this.handleSuccessfulUserCreation();
            return;
        }

        this.handleSuccessfulUserUpdate();
    },

    handleSuccessfulUserCreation: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sSuccessMessage = "Agent '" + oModel.getUsername() + "' created successfully";
        this.showSuccessMessageInStrip(sSuccessMessage);

        const oFieldsWrapper = sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_FIELDS_WRAPPER_FLEXBOX);
        oFieldsWrapper.destroyItems();
        oFieldsWrapper.removeAllItems();
        this.setObjectModel(new UserEditorObjectModel()); // reset the object model so that we start anew
        this.createFieldsAndSubmitButton(oFieldsWrapper);
    },

    handleSuccessfulUserUpdate: function() {
        const oController = this.getController();
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_USER_EDITOR);
        const sUsername = oModel.getUsername();
        const sUpdatePageTitle = Globals.POLLITI_PAGE_UPDATE_USER_TITLE_PREFIX + "'" + sUsername + "'";
        oModel.setInitialUsername(sUsername);
        oController.changeHTMLPageTitle(sUpdatePageTitle);
        oPage.setTitle(sUpdatePageTitle);

        const sSuccessMessage = "Agent '" + sUsername + "' updated successfully";
        this.showSuccessMessageInStrip(sSuccessMessage);
    },

    showSuccessMessageInStrip: function(sMessage) {
        const oSuccessMessageStrip = sap.ui.getCore().byId(UIComponents.USER_EDITOR_SUCCESS_MESSAGE_STRIP);
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