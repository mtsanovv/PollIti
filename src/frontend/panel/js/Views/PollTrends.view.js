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
        const thisView = this;
        const oSelectDialog = new sap.m.SelectDialog(UIComponents.POLL_TRENDS_SELECT_DIALOG, {
            growing: false,
            title: Globals.POLL_TRENDS_POLL_INPUT_PLACEHOLDER,
            showClearButton: true
        });
        oSelectDialog.attachConfirm(this.onPollSelected)
                     .attachCancel(() => {
                        // to ensure that the context in updatePollInputOnSelectDialogClose is always the view
                        thisView.updatePollInputOnSelectDialogClose();
                     })
                     .attachLiveChange(this.filterSelectDialogItems);

        const oSelectDialogClearButton = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG_CLEAR_BUTTON);
        oSelectDialogClearButton.attachPress(this.onSelectDialogClearButtonPressed);
        // this DOES NOT override the default SelectDialog clear button press event handler, it is rather an extra handler

        const oSelectDialogSearchField = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG_SEARCH_FIELD);
        oSelectDialogSearchField.setShowSearchButton(false); // because there's no SelectDialog property to hide it (and all other search fields in the app react to liveChange)

        oPage.addContent(oSelectDialog);
    },

    onPollSelected: function(oEvent) {
        // this here does not reference the view, so we need to manually get it
        const oView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_POLL_TRENDS);
        const oSelectDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG);
        const oModel = oView.getModel().getProperty(Globals.MODEL_PATH);
        const oSelectedItem = oEvent.getParameters().selectedItem;
        const iPollId = parseInt(oSelectedItem.getTitle(), 10);
        const iSelectedItemIndexInSelectDialog = oSelectDialog.getItems().findIndex((oItem) => oItem == oSelectedItem);

        oModel.addPollToPollsParticipatingInTrend(iPollId, iSelectedItemIndexInSelectDialog);
        oView.updatePollInputOnSelectDialogClose();
    },

    updatePollInputOnSelectDialogClose: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const iPollInputIndexThatTriggeredSelectionDialog = oModel.getPollInputIndexThatTriggeredSelectionDialog();
        const aPollsParticipatingInTrend = oModel.getPollsParticipatingInTrend();
        const oPollParticipatingInTrendFromInputIndex = aPollsParticipatingInTrend[iPollInputIndexThatTriggeredSelectionDialog];

        const oPollInputsWrappingFlexBox = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_POLL_INPUTS_WRAPPER_FLEXBOX);
        const aPollInputs = oPollInputsWrappingFlexBox.getItems();
        const oPollInputParticipatingInTrendFromInputIndex = aPollInputs[iPollInputIndexThatTriggeredSelectionDialog];

        // whenever the dialog is closed the amount of polls chosen needs to be evaluated in order to toggle the chart generation button
        this.toggleChartGenerationButton();

        if(oPollParticipatingInTrendFromInputIndex != null) {
            oPollInputParticipatingInTrendFromInputIndex.setValue(Globals.ID_SIGN + oPollParticipatingInTrendFromInputIndex.pollId);
            return;
        }

        oPollInputParticipatingInTrendFromInputIndex.resetProperty(Globals.INPUT_VALUE_PROPERTY);
    },

    toggleChartGenerationButton: function() {
        const oChartGenerationButton = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_CHART_GENERATION_BUTTON);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const iPollsParticipatingInTrendThatAreNotNull = oModel.getPollsParticipatingInTrend().filter((oElement) => oElement != null).length;
        if(iPollsParticipatingInTrendThatAreNotNull < ValidationConstants.POLL_TRENDS_MIN_POLLS) {
            oChartGenerationButton.setEnabled(false);
            return;
        }

        oChartGenerationButton.setEnabled(true);
    },

    filterSelectDialogItems: function(oEvent) {
        // this here does not reference the view, so we need to manually get it
        const oView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_POLL_TRENDS);
        const oModel = oView.getModel().getProperty(Globals.MODEL_PATH);
        const aHiddenPollsSelectDialogItemsIndices = oModel.getHiddenPollsSelectDialogItemsIndices();
        const oSelectDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG);
        const aSelectDialogItems = oSelectDialog.getItems(); 
        const sQuery = Globals.escapeRegex(oEvent.getParameters().value);
        const oRegExp = new RegExp(sQuery, 'i');

        for(let i = 0; i < aSelectDialogItems.length; i++) {
            if(aHiddenPollsSelectDialogItemsIndices.indexOf(i) > -1) {
                // do not do anything to the polls that are hidden from the preopen phase of the dialog
                continue;
            }
            const oItem = aSelectDialogItems[i];
            const aStringsToLookForMatches = [oItem.getTitle(), oItem.getInfo(), oItem.getDescription()];
            let bShowItem = false;
            for(const s of aStringsToLookForMatches) {
                if(s.match(oRegExp)) {
                    bShowItem = true;
                    break;
                }
            }
            oItem.setVisible(bShowItem);
        }
    },

    onSelectDialogClearButtonPressed: function() {
        // this here does not reference the view, so we need to manually get it
        const oView = sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_POLL_TRENDS);
        const oModel = oView.getModel().getProperty(Globals.MODEL_PATH);
        const iPollInputIndexThatTriggeredSelectionDialog = oModel.getPollInputIndexThatTriggeredSelectionDialog();
        const oSelectDialogCancelButton = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG_CANCEL_BUTTON);

        // no need to mark the list item in the dialog as visible because it was already visible (if there was one selected)
        oModel.nullPollThatIsParticipatingInTrend(iPollInputIndexThatTriggeredSelectionDialog);
        oSelectDialogCancelButton.firePress(); // because SelectDialog does not have a close method
    },

    createPageLayout: function(oPage) {
        const oBlockLayout = new sap.ui.layout.BlockLayout(UIComponents.POLL_TRENDS_BLOCK_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell({ title: Globals.POLL_TRENDS_LAYOUT_TITLE, titleAlignment: sap.ui.core.HorizontalAlign.Center });
        const oWrappingFlexBox = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Column });

        this.createPollSelectionInputs(oWrappingFlexBox);
        this.createPollInputsAdjustmentButtons(oWrappingFlexBox);
        this.createChartGenerationButton(oWrappingFlexBox);

        oBlockLayoutCell.addContent(oWrappingFlexBox);
        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oBlockLayout.addContent(oBlockLayoutRow);
        oPage.addContent(oBlockLayout);
    },

    createChartGenerationButton: function(oWrappingFlexBox) {
        const oController = this.getController();
        const oChartGenerationButton = new sap.m.Button(UIComponents.POLL_TRENDS_CHART_GENERATION_BUTTON, {
            type: sap.m.ButtonType.Emphasized,
            text: Globals.POLL_TRENDS_CHART_GENERATION_BUTTON_TEXT,
            enabled: false
        });
        oChartGenerationButton.attachPress((oEvent) => {
                                  oEvent.getSource().setBusy(true);
                                  oController.fetchSelectedPollsDetails();
                              })
                              .setBusyIndicatorDelay(0);
        oWrappingFlexBox.addItem(oChartGenerationButton);
    },

    selectionDialogTriggeredFromPollInput: function(iPollInputIndex) {
        const oSelectDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);

        oModel.setPollInputIndexThatTriggeredSelectionDialog(iPollInputIndex);

        this.preOpenSelectDialog();
        oSelectDialog.open();
        this.postOpenSelectDialog();
    },

    preOpenSelectDialog: function() {
        const oSelectDialog = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG);
        const aSelectDialogItems = oSelectDialog.getItems();
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const iPollInputIndexThatTriggeredSelectionDialog = oModel.getPollInputIndexThatTriggeredSelectionDialog();
        const aPollsParticipatingInTrend = oModel.getPollsParticipatingInTrend();
        const oPollParticipatingInTrendFromInputIndex = aPollsParticipatingInTrend[iPollInputIndexThatTriggeredSelectionDialog];

        // set selected item
        if(oPollParticipatingInTrendFromInputIndex != null) {
            const oSelectDialogItem = aSelectDialogItems[oPollParticipatingInTrendFromInputIndex.selectDialogItemIndex];
            oSelectDialogItem.setSelected(true);
            oSelectDialogItem.setVisible(true);
        }

        const aHiddenPollsSelectDialogItemsIndices = [];
        // hide selected items from other poll inputs
        for(let i = 0; i < aPollsParticipatingInTrend.length; i++) {
            if(i == iPollInputIndexThatTriggeredSelectionDialog) {
                continue;
            }

            const oPollParticipatingInTrend = aPollsParticipatingInTrend[i];

            if(oPollParticipatingInTrend == null) {
                continue;
            }

            aHiddenPollsSelectDialogItemsIndices.push(oPollParticipatingInTrend.selectDialogItemIndex);
            aSelectDialogItems[oPollParticipatingInTrend.selectDialogItemIndex].setVisible(false);
        }

        oModel.setHiddenPollsSelectDialogItemsIndices(aHiddenPollsSelectDialogItemsIndices);
    },

    postOpenSelectDialog: function() {
        const oSelectDialogClearButton = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_SELECT_DIALOG_CLEAR_BUTTON);
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const iPollInputIndexThatTriggeredSelectionDialog = oModel.getPollInputIndexThatTriggeredSelectionDialog();
        const oPollParticipatingInTrend = oModel.getPollsParticipatingInTrend()[iPollInputIndexThatTriggeredSelectionDialog];
        const bShouldSelectDialogClearButtonBeEnabled = oPollParticipatingInTrend != null;

        // the only way to make the clear button clickable is to enable it after the selectdialog is open
        oSelectDialogClearButton.setEnabled(bShouldSelectDialogClearButtonBeEnabled);
    },

    createPollSelectionInputs: function(oWrappingFlexBox) {
        const oFieldsWrappingFlexBox = new sap.m.FlexBox(UIComponents.POLL_TRENDS_POLL_INPUTS_WRAPPER_FLEXBOX, {
            justifyContent: sap.m.FlexJustifyContent.Center,
            wrap: sap.m.FlexWrap.Wrap
        });
        oFieldsWrappingFlexBox.addStyleClass('sapUiMediumMarginTop')
                              .addStyleClass('sapUiSmallMarginBottom');

        for(let i = 0; i < ValidationConstants.POLL_TRENDS_MIN_POLLS; i++) {
            this.createPollSelectionInput(oFieldsWrappingFlexBox);
        }

        oWrappingFlexBox.addItem(oFieldsWrappingFlexBox);
    },

    createPollSelectionInput: function(oWrappingFlexBox) {
        const thisView = this;
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const iIndex = oWrappingFlexBox.getItems().length;

        const oInput = new sap.m.Input({ showValueHelp: true, valueHelpOnly: true });
        oInput.addStyleClass('sapUiSmallMarginBottom')
              .addStyleClass('sapUiTinyMarginEnd')
              .setPlaceholder(Globals.POLL_TRENDS_POLL_INPUT_PLACEHOLDER)
              .setWidth(Globals.POLL_SELECT_INPUT_WIDTH)
              .attachValueHelpRequest(() => { thisView.selectionDialogTriggeredFromPollInput(iIndex); });

        oWrappingFlexBox.addItem(oInput);
        oModel.addPollToPollsParticipatingInTrend();
    },

    removeLastPollSelectionInput: function(oWrappingFlexBox) {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPollInputs = oWrappingFlexBox.getItems();
        const iLastInputConsecutiveNumber = aPollInputs.length - 1;
        const oLastInput = aPollInputs[iLastInputConsecutiveNumber];

        oWrappingFlexBox.removeItem(oLastInput);
        oModel.removeLastPollFromPollsParticipatingInTrend();
        oLastInput.destroy();
    },

    createPollInputsAdjustmentButtons: function(oWrappingFlexBox) {
        const thisView = this;
        const oFlexBoxInputsWrapper = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_POLL_INPUTS_WRAPPER_FLEXBOX);

        const oFlexBoxAdjustmentButtonsWrapper = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Center, direction: sap.m.FlexDirection.Row});
        oFlexBoxAdjustmentButtonsWrapper.addStyleClass('sapUiMediumMarginBottom');

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
        const oChartGenerationButton = sap.ui.getCore().byId(UIComponents.POLL_TRENDS_CHART_GENERATION_BUTTON);

        if(oPageBlockLayout) {
            oPage.removeContent(oPageBlockLayout);
            oPageBlockLayout.destroy();
            oChartGenerationButton.setBusy(false);
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