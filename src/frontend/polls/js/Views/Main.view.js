sap.ui.jsview(UIComponents.POLLITI_VIEW_MAIN, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_MAIN;
    },

    createContent: function(oController) {
        const oToolPage = new sap.tnt.ToolPage(UIComponents.POLLITI_PAGE_MAIN, { sideExpanded: false });
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
    },

    createPageDialog: function(oToolPage) {
        const oDialog = new sap.m.Dialog(UIComponents.MAIN_PAGE_DIALOG_ID, { titleAlignment: sap.m.TitleAlignment.Center, type: sap.m.DialogType.Message });
        const oMessageStrip = new sap.m.MessageStrip(UIComponents.MAIN_PAGE_DIALOG_MESSAGE_STRIP_ID, { type: sap.ui.core.MessageType.None, showIcon: true });
        oMessageStrip.addStyleClass('sapUiResponsiveMargin');
        oDialog.addContent(oMessageStrip);
        oToolPage.addMainContent(oDialog);
    }
});