sap.ui.jsview(UIComponents.POLLITI_VIEW_POLL_TRENDS, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_POLL_TRENDS;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_POLL_TRENDS, { title: Globals.POLLITI_PAGE_POLL_TRENDS_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => {
            oController.navToPrevious();
        });

        this.createSelectDialog(oPage);
        this.createErrorDialog(oPage);

        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog(UIComponents.POLL_TRENDS_ERROR_DIALOG, {
            title: Globals.ERROR_DIALOG_TITLE,
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });

        const oErrorDialogMessageStrip = new sap.m.MessageStrip(UIComponents.POLL_TRENDS_ERROR_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.Error, showIcon: true });
        oErrorDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');

        const oErrorDialogNavToLaunchpadButton = new sap.m.Button({ text: Globals.DIALOG_CONTINUE_TO_LAUNCHPAD_BUTTON_TEXT, type: sap.m.ButtonType.Emphasized });
        oErrorDialogNavToLaunchpadButton.attachPress(() => {
            oErrorDialog.close();
            oController.navTo(Globals.NAV_LAUNCHPAD);
        });

        oErrorDialog.addContent(oErrorDialogMessageStrip);
        oErrorDialog.addButton(oErrorDialogNavToLaunchpadButton);
        oPage.addContent(oErrorDialog);
    },

    createSelectDialog: function(oPage) {
        const oSelectDialog = new sap.m.SelectDialog(UIComponents.POLL_TRENDS_SELECT_DIALOG, { growing: false, title: Globals.POLL_TRENDS_POLL_INPUT_PLACEHOLDER });
        oPage.addContent(oSelectDialog);
    },

    createPageLayout: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout(UIComponents.POLL_TRENDS_BLOCK_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell({ title: Globals.POLL_TRENDS_LAYOUT_TITLE, titleAlignment: sap.ui.core.HorizontalAlign.Center });
        const oWrappingFlexBox = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column });

        this.createPollSelectionInputs(oWrappingFlexBox);
        this.createPollInputsAdjustmentButtons(oWrappingFlexBox);

        oBlockLayoutCell.addContent(oWrappingFlexBox);
        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oBlockLayout.addContent(oBlockLayoutRow);
        oPage.addContent(oBlockLayout);
    },

    selectionDialogTriggeredFromPollInput: function(iPollInputIndex) {
        const oSelectDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);

        oModel.setPollInputIndexThatTriggeredSelectionDialog(iPollInputIndex);
        oSelectDialog.open();
    },

    createPollSelectionInputs: function(oWrappingFlexBox) {
        const oFieldsWrappingFlexBox = new sap.m.FlexBox(UIComponents.POLL_TRENDS_POLL_INPUTS_WRAPPER_FLEXBOX, {
            justifyContent: sap.m.FlexJustifyContent.Center,
            wrap: sap.m.FlexWrap.Wrap
        });
        oFieldsWrappingFlexBox.addStyleClass('sapUiMediumMarginTopBottom');

        for(let i = 0; i < ValidationConstants.POLL_TRENDS_MIN_POLLS; i++) {
            this.createPollSelectionInput(oFieldsWrappingFlexBox);
        }

        oWrappingFlexBox.addItem(oFieldsWrappingFlexBox);
    },

    createPollSelectionInput: function(oWrappingFlexBox) {
        const thisView = this;
        const iIndex = oWrappingFlexBox.getItems().length;
        const oInput = new sap.m.Input({ showValueHelp: true, valueHelpOnly: true });
        oInput.addStyleClass('sapUiSmallMarginBottom')
              .addStyleClass('sapUiTinyMarginEnd')
              .setPlaceholder(Globals.POLL_TRENDS_POLL_INPUT_PLACEHOLDER)
              .setWidth(Globals.INPUT_WIDTH)
              .attachValueHelpRequest(() => { thisView.selectionDialogTriggeredFromPollInput(iIndex); });

        oWrappingFlexBox.addItem(oInput);
    },

    removeLastPollSelectionInput: function(oWrappingFlexBox) {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPollInputs = oWrappingFlexBox.getItems();
        const iLastInputConsecutiveNumber = aPollInputs.length - 1;
        const oLastInput = aPollInputs[iLastInputConsecutiveNumber];

        oWrappingFlexBox.removeItem(oLastInput);
        oModel.removeParticipatingPollInTrendAt(iLastInputConsecutiveNumber);
        oLastInput.destroy();
    },

    createPollInputsAdjustmentButtons: function(oWrappingFlexBox) {
        const thisView = this;
        const oFlexBoxInputsWrapper = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_POLL_INPUTS_WRAPPER_FLEXBOX);

        const oFlexBoxAdjustmentButtonsWrapper = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Row});
        oFlexBoxAdjustmentButtonsWrapper.addStyleClass('sapUiSmallMarginBottom');

        const oAddInputButton = new sap.m.Button({ icon: 'sap-icon://add', text: Globals.ADD_POLL_INPUT_TEXT });
        oAddInputButton.addStyleClass('sapUiTinyMarginEnd')
                       .attachPress(() => {
                           thisView.createPollSelectionInput(oFlexBoxInputsWrapper);
                           if(oFlexBoxInputsWrapper.getItems().length == ValidationConstants.POLL_TRENDS_MAX_POLL_INPUTS) {
                               oAddInputButton.setEnabled(false);
                           }

                           if(oFlexBoxInputsWrapper.getItems().length > ValidationConstants.POLL_TRENDS_MIN_POLLS) {
                               oRemoveInputButton.setEnabled(true);
                           }
                       });

        const oRemoveInputButton = new sap.m.Button({ icon: 'sap-icon://less', text: Globals.REMOVE_POLL_INPUT_TEXT });
        oRemoveInputButton.setEnabled(false)
                          .attachPress(() => {
                              thisView.removeLastPollSelectionInput(oFlexBoxInputsWrapper);
                              if(oFlexBoxInputsWrapper.getItems().length < ValidationConstants.POLL_TRENDS_MAX_POLL_INPUTS) {
                                  oAddInputButton.setEnabled(true);
                              }

                              if(oFlexBoxInputsWrapper.getItems().length == ValidationConstants.POLL_TRENDS_MIN_POLLS) {
                                  oRemoveInputButton.setEnabled(false);
                              }
                          });

        oFlexBoxAdjustmentButtonsWrapper.addItem(oAddInputButton);
        oFlexBoxAdjustmentButtonsWrapper.addItem(oRemoveInputButton);

        oWrappingFlexBox.addItem(oFlexBoxAdjustmentButtonsWrapper);
    },

    loadPage: function() {
        this.resetPage();
        this.getController().pageLoaded();
    },

    resetPage: function() {
        const oPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_POLL_TRENDS);
        const oPageBlockLayout = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_BLOCK_LAYOUT);
        const oSelectDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG);

        if(oPageBlockLayout) {
            oPage.removeContent(oPageBlockLayout);
            oPageBlockLayout.destroy();
        }

        oSelectDialog.destroyItems();
        oSelectDialog.removeAllItems();
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
        const oErrorDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_ERROR_DIALOG);
        const oErrorDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_ERROR_DIALOG_MESSAGE_STRIP);

        if(sMessage) {
            oErrorDialogMessageStrip.setText(sMessage);
            oErrorDialog.open();
        }
    },

    applyViewSpecificObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPolls = oModel.getPolls();

        if(aPolls) {
            this.loadPolls();
        }
    },

    loadPolls: function() {
        const oPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_POLL_TRENDS);
        this.fillPollsInSelectDialog();
        this.createPageLayout(oPage);
    },

    fillPollsInSelectDialog: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPolls = oModel.getPolls();
        const oSelectDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG);

        for(const oPoll of aPolls) {
            const oStandardListItem = new sap.m.StandardListItem({ title: oPoll.id,  description: oPoll.title, info: oPoll.creationDate, wrapping: true });
            oSelectDialog.addItem(oStandardListItem);
        }

        this.getController().setAppBusy(false);
    },
});