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
        oToolPageHeader.addContent(new sap.m.Title({ text: CONFIG.AGENCY_NAME, level: 'H1', textAlign: sap.ui.core.TextAlign.Center }));
        oToolPageHeader.addContent(new sap.m.ToolbarSpacer());
        oToolPage.setHeader(oToolPageHeader);
    },

    createToolPageMainContent: function(oToolPage) {
        this.createPageDialog(oToolPage);
        this.createPageLayout(oToolPage);
    },

    createPageDialog: function(oToolPage) {
        const oDialog = new sap.m.Dialog(UIComponents.MAIN_PAGE_DIALOG_ID, { titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oMessageStrip = new sap.m.MessageStrip(UIComponents.MAIN_PAGE_DIALOG_MESSAGE_STRIP_ID, { type: sap.ui.core.MessageType.None, showIcon: true });
        oMessageStrip.addStyleClass('sapUiResponsiveMargin');
        oDialog.addContent(oMessageStrip);
        oToolPage.addMainContent(oDialog);
    },

    createPageLayout: function(oToolPage) {
        const oGridWrapperLayout = new sap.ui.layout.Grid({ position: sap.ui.layout.GridPosition.Center, defaultIndent: 'XL3 L2 M1 S0', defaultSpan: 'XL6 L8 M10 S12' });
        const oMainLayout = new sap.ui.layout.BlockLayout(UIComponents.MAIN_PAGE_LAYOUT, { background: sap.ui.layout.BlockBackgroundType.Dashboard });
        oGridWrapperLayout.addContent(oMainLayout);
        oToolPage.addMainContent(oGridWrapperLayout);
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
        oBlockLayoutCell.addContent(oWrappingFlexBox);
    },

    addPollOptionsToFlexBox: function(oFlexBox) {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPollOptions = oModel.getPollOptions();
        const oRadioButtonGroup = new sap.m.RadioButtonGroup({ selectedIndex: -1 })

        for(const sOption of aPollOptions) {
            const oRadioButton = new sap.m.RadioButton({ text: sOption });
            oRadioButtonGroup.addButton(oRadioButton);
        }
    
        oFlexBox.addItem(oRadioButtonGroup);
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