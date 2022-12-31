sap.ui.jsview(UIComponents.POLLITI_VIEW_MAIN, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_MAIN;
    },

    createContent: function(oController) {
        const oToolPage = new sap.tnt.ToolPage(UIComponents.POLLITI_PAGE_MAIN, { sideExpanded: false });
        oToolPage.setBusyIndicatorDelay(0);
        this.createToolPageHeader(oToolPage);
        this.createToolPageMainContent(oToolPage);
        return oToolPage;
    },

    createToolPageHeader: function(oToolPage) {
        const oToolPageHeader = new sap.tnt.ToolHeader();
        oToolPageHeader.addContent(new sap.m.ToolbarSpacer());
        oToolPageHeader.addContent(new sap.m.Title({ text: Config.AGENCY_NAME, level: 'H1', textAlign: sap.ui.core.TextAlign.Center }));
        oToolPageHeader.addContent(new sap.m.ToolbarSpacer());
        oToolPage.setHeader(oToolPageHeader);
    },

    createToolPageMainContent: function(oToolPage) {
        // despite the fact that we don't need routing we still need to create an App object with a Page inside
        // that's done in order to make the OpenUI5 app work properly
        const oApp = new sap.m.App();
        const oPage = new sap.m.Page({ showHeader: false });
        this.createPageDialog(oPage);
        this.createPageLayout(oPage);
        oApp.addPage(oPage);
        oToolPage.addMainContent(oApp);
    },

    createPageDialog: function(oPage) {
        const oDialog = new sap.m.Dialog(UIComponents.MAIN_PAGE_DIALOG_ID, { titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oMessageStrip = new sap.m.MessageStrip(UIComponents.MAIN_PAGE_DIALOG_MESSAGE_STRIP_ID, { type: sap.ui.core.MessageType.None, showIcon: true });
        oMessageStrip.addStyleClass('sapUiResponsiveMargin');
        oDialog.addContent(oMessageStrip);
        oPage.addContent(oDialog);
    },

    createPageLayout: function(oPage) {
        const oGridWrapperLayout = new sap.ui.layout.Grid({ position: sap.ui.layout.GridPosition.Center, defaultIndent: 'XL4 L3 M2 S0', defaultSpan: 'XL4 L6 M8 S12' });
        const oMainLayout = new sap.ui.layout.BlockLayout(UIComponents.MAIN_PAGE_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        oGridWrapperLayout.addContent(oMainLayout);
        oPage.addContent(oGridWrapperLayout);
    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();
        const aPollOptions = oModel.getPollOptions();
        if(sMessage) {
            this.showDialog();
            return;
        }
        if(aPollOptions) {
            this.fillLayout();
        }
    },

    fillLayout: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const oLayout = sap.ui.getCore().byId(UIComponents.MAIN_PAGE_LAYOUT);

        const oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow();
        const oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell( { title: oModel.getPollTitle() });

        this.fillLayoutCell(oBlockLayoutCell);

        oBlockLayoutRow.addContent(oBlockLayoutCell);
        oLayout.addContent(oBlockLayoutRow);
    },

    fillLayoutCell: function(oBlockLayoutCell) {
        const oWrappingFlexBox = new sap.m.FlexBox({ direction: sap.m.FlexDirection.Column });
        this.addPollOptionsToFlexBox(oWrappingFlexBox);
        this.addSubmitButtonToFlexBox(oWrappingFlexBox);
        oBlockLayoutCell.addContent(oWrappingFlexBox);
    },

    addPollOptionsToFlexBox: function(oFlexBox) {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPollOptions = [...oModel.getPollOptions(), Globals.UNDECIDED_OPTION];
        const oRadioButtonGroup = new sap.m.RadioButtonGroup(UIComponents.MAIN_PAGE_RADIO_BUTTON_GROUP, { selectedIndex: -1 })

        for(const sOption of aPollOptions) {
            const oRadioButton = new sap.m.RadioButton({ text: sOption });
            oRadioButtonGroup.addButton(oRadioButton);
        }

        oRadioButtonGroup.attachSelect(this.optionSelected);
        oFlexBox.addItem(oRadioButtonGroup);
    },

    addSubmitButtonToFlexBox: function(oFlexBox) {
        const thisView = this;
        const oSubmitButton = new sap.m.Button(UIComponents.MAIN_PAGE_SUBMIT_BUTTON, { text: Globals.SUBMIT_BUTTON_TEXT, type: sap.m.ButtonType.Emphasized, width: '100%' });
        oSubmitButton.setEnabled(false);
        oSubmitButton.attachPress(() => {
            const oModel = thisView.getModel().getProperty(Globals.MODEL_PATH);
            const oRadioButtonGroup = sap.ui.getCore().byId(UIComponents.MAIN_PAGE_RADIO_BUTTON_GROUP);
            oModel.setSelectedOptionIndex(oRadioButtonGroup.getSelectedIndex());
            thisView.getController().onSubmit();
        });
        oFlexBox.addItem(oSubmitButton);
    },

    optionSelected: function() {
        const oSubmitButton = sap.ui.getCore().byId(UIComponents.MAIN_PAGE_SUBMIT_BUTTON);
        if(!oSubmitButton.getEnabled()) {
            oSubmitButton.setEnabled(true);
        }
    },

    showDialog: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();
        const bIsSuccess = oModel.isSuccess();
        const oDialog = sap.ui.getCore().byId(UIComponents.MAIN_PAGE_DIALOG_ID);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.MAIN_PAGE_DIALOG_MESSAGE_STRIP_ID);

        if(bIsSuccess) {
            oDialogMessageStrip.setType(sap.ui.core.MessageType.Success);
            oDialog.setTitle(ValidationMessages.SUCCESS);
        } else { 
            oDialogMessageStrip.setType(sap.ui.core.MessageType.Error);
            oDialog.setTitle(ValidationMessages.AN_ERROR_HAS_OCCURRED);
        }

        oDialogMessageStrip.setText(sMessage);
        oDialog.open();
    }
});