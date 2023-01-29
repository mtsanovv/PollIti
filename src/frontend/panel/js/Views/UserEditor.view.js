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
        const oPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_USER_EDITOR);
        const oModel = new UserEditorObjectModel({});

        if(sUserToEdit) {
            oModel.setIsUserUpdate(true);
            oModel.setUsername(sUserToEdit);
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
        const oWrappingFlexBox = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column  });

        this.createSuccessMessageStrip(oWrappingFlexBox);
        this.createUsernameInput(oWrappingFlexBox);
        this.createDisplayNameInput(oWrappingFlexBox);
        this.createPasswordInput(oWrappingFlexBox);
        this.createPasswordConfirmationInput(oWrappingFlexBox);
        this.createEnabledInput(oWrappingFlexBox);
        this.createSubmitButton(oWrappingFlexBox);

        oBlockLayoutCell.addContent(oWrappingFlexBox);
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
            return;
        }

        oInput.setValueState(sap.ui.core.ValueState.None);
    },

    createDisplayNameInput: function(oWrappingFlexBox) {

    },

    createPasswordInput: function(oWrappingFlexBox) {

    },

    createPasswordConfirmationInput: function(oWrappingFlexBox) {

    },

    createEnabledInput: function(oWrappingFlexBox) {

    },

    createSubmitButton: function(oWrappingFlexBox) {

    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
    },

    setObjectModel: function(oObjectModel) {
        const oModel = {
            [Globals.MODEL_PATH_KEY]: oObjectModel
        };
        this.setModel(new sap.ui.model.json.JSONModel(oModel));
    }
});