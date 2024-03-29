sap.ui.jsview(UIComponents.POLLITI_VIEW_LOGIN, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_LOGIN;
    },

    createContent: function() {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_LOGIN, { showHeader: false });

        this.createErrorDialog(oPage);
        this.createForm(oPage);

        return oPage;
    },

    createForm: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout(UIComponents.LOGIN_BLOCK_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell({ title: Globals.POLLITI_PAGE_LOGIN_TITLE, titleAlignment: sap.ui.core.HorizontalAlign.Center });

        this.fillFormBlockLayoutCell(oBlockLayoutCell);

        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oBlockLayout.addContent(oBlockLayoutRow);
        oPage.addContent(oBlockLayout);
    },

    fillFormBlockLayoutCell: function(oBlockLayoutCell) {
        const oWrappingFlexBox = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column  });

        this.createUsernameInput(oWrappingFlexBox);
        this.createPasswordInput(oWrappingFlexBox);
        this.createLoginButton(oWrappingFlexBox);

        oBlockLayoutCell.addContent(oWrappingFlexBox);
    },

    validateLoginFormFieldValue: function(oInput, iMinInputLength) {
        // no need to put it in the model - just like we have a max length of the field, this method just 'enforces' min field length, this is not actual validation
        const sValue = oInput.getValue();
        if(sValue.length < iMinInputLength) {
            oInput.setValueState(sap.ui.core.ValueState.Error);
            return false;
        }
        if(oInput.getValueState() == sap.ui.core.ValueState.Error) {
            oInput.setValueState(sap.ui.core.ValueState.None);
        }
        return true;
    },

    validateUsernameFieldValue: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_LOGIN);
        return oLoginPageView.validateLoginFormFieldValue(
            sap.ui.getCore().byId(UIComponents.LOGIN_USERNAME_INPUT),
            ValidationConstants.USERNAME_INPUT_MIN_LENGTH,
        );
    },

    validatePasswordFieldValue: function() {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_LOGIN);
        return oLoginPageView.validateLoginFormFieldValue(
            sap.ui.getCore().byId(UIComponents.LOGIN_PASSWORD_INPUT),
            ValidationConstants.PASSWORD_INPUT_MIN_LENGTH,
        );
    },

    createUsernameInput: function(oWrappingFlexBox) {
        const oInputUsername = new sap.m.Input(UIComponents.LOGIN_USERNAME_INPUT, { maxLength: ValidationConstants.USERNAME_INPUT_MAX_LENGTH });
        oInputUsername.addStyleClass('sapUiSmallMarginBottom')
                      .setShowValueStateMessage(false)
                      .setPlaceholder(Globals.USERNAME_INPUT_PLACEHOLDER)
                      .setRequired(true)
                      .attachLiveChange(this.validateUsernameFieldValue)
                      .setWidth(Globals.INPUT_WIDTH);

        oWrappingFlexBox.addItem(oInputUsername);
    },

    createPasswordInput: function(oWrappingFlexBox) {
        const oInputPassword = new sap.m.Input(UIComponents.LOGIN_PASSWORD_INPUT, { maxLength: ValidationConstants.PASSWORD_INPUT_MAX_LENGTH, type: sap.m.InputType.Password });
        oInputPassword.addStyleClass('sapUiSmallMarginBottom')
                      .setShowValueStateMessage(false)
                      .setPlaceholder(Globals.PASSWORD_INPUT_PLACEHOLDER)
                      .setRequired(true)
                      .attachLiveChange(this.validatePasswordFieldValue)
                      .setWidth(Globals.INPUT_WIDTH);

        oWrappingFlexBox.addItem(oInputPassword);
    },

    createLoginButton: function(oWrappingFlexBox) {
        const oLoginButton = new sap.m.Button(UIComponents.LOGIN_BUTTON, { type: sap.m.ButtonType.Emphasized, text: Globals.POLLITI_PAGE_LOGIN_TITLE });
        oLoginButton.attachPress(this.onLoginButtonPress)
                    .setBusyIndicatorDelay(0);
        oWrappingFlexBox.addItem(oLoginButton);
    },

    createErrorDialog: function(oPage) {
        const oErrorDialog = new sap.m.Dialog(UIComponents.LOGIN_ERROR_DIALOG, {
            title: Globals.ERROR_DIALOG_TITLE,
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });
        const oErrorDialogMessageStrip = new sap.m.MessageStrip(UIComponents.LOGIN_ERROR_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.Error, showIcon: true });
        oErrorDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');
        const oErrorDialogDismissButton = new sap.m.Button({ text: Globals.DIALOG_DISMISS_BUTTON_TEXT, type: sap.m.ButtonType.Emphasized });
        oErrorDialogDismissButton.attachPress(() => {
            oErrorDialog.close();
        });

        oErrorDialog.addContent(oErrorDialogMessageStrip);
        oErrorDialog.addButton(oErrorDialogDismissButton);
        oPage.addContent(oErrorDialog);
    },

    onLoginButtonPress: function(oEvent) {
        // this here does not reference the view, so we need to manually get it
        const oLoginPageView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_LOGIN);
        const bIsUsernameValid = oLoginPageView.validateUsernameFieldValue();
        const bIsPasswordValid = oLoginPageView.validatePasswordFieldValue();

        if(!bIsUsernameValid || !bIsPasswordValid) {
            return;
        }

        oLoginPageView.setObjectModel(new LoginObjectModel({ 
            username: sap.ui.getCore().byId(UIComponents.LOGIN_USERNAME_INPUT).getValue(),
            password: sap.ui.getCore().byId(UIComponents.LOGIN_PASSWORD_INPUT).getValue()
        }));

        oEvent.getSource().setBusy(true);

        oLoginPageView.getController().attemptLogin();
    },

    loadPage: function() {
        this.resetPage();
        this.getController().pageLoaded();
    },

    resetPage: function() {
        const oSubmitButton = sap.ui.getCore().byId(UIComponents.LOGIN_BUTTON);
        const aInputs = [sap.ui.getCore().byId(UIComponents.LOGIN_USERNAME_INPUT), sap.ui.getCore().byId(UIComponents.LOGIN_PASSWORD_INPUT)];

        for(const oInput of aInputs) {
            oInput.resetProperty(Globals.INPUT_VALUE_PROPERTY);
        }

        oSubmitButton.setBusy(false);
    },

    setObjectModel: function(oObjectModel) {
        const oModel = {
            [Globals.MODEL_PATH_KEY]: oObjectModel
        };
        this.setModel(new sap.ui.model.json.JSONModel(oModel));
    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();
        const oErrorDialog = sap.ui.getCore().byId(UIComponents.LOGIN_ERROR_DIALOG);
        const oErrorDialogMessageStrip = sap.ui.getCore().byId(UIComponents.LOGIN_ERROR_DIALOG_MESSAGE_STRIP);
        const oSubmitButton = sap.ui.getCore().byId(UIComponents.LOGIN_BUTTON);

        if(sMessage) {
            oSubmitButton.setBusy(false);
            oErrorDialogMessageStrip.setText(sMessage);
            oErrorDialog.open();
        }
    },
});