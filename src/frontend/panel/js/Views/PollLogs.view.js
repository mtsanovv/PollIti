sap.ui.jsview(UIComponents.POLLITI_VIEW_POLL_LOGS, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_POLL_LOGS;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_POLL_LOGS, { title: Globals.POLLITI_PAGE_POLL_LOGS_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => {
            oController.navToPrevious();
        });

        this.createErrorDialog(oPage);
        this.createPollLogsTable(oPage);

        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog(UIComponents.POLL_LOGS_ERROR_DIALOG, {
            title: Globals.ERROR_DIALOG_TITLE,
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });

        const oErrorDialogMessageStrip = new sap.m.MessageStrip(UIComponents.POLL_LOGS_ERROR_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.Error, showIcon: true });
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

    createPollLogsTable: function(oPage) {
        const oTable = new sap.m.Table(UIComponents.POLL_LOGS_TABLE);
        oTable.addStyleClass('sapUiResponsiveMargin')
              .setWidth('auto');

        this.createPollLogsTableHeader(oTable);
        this.createPollLogaTableColumns(oTable);

        oPage.addContent(oTable);
    },

    createPollLogsTableHeader: function(oTable) {
        const thisView = this;
        const oTableHeaderToolbar = new sap.m.Toolbar();
        const oTableLabel = new sap.m.Label(UIComponents.POLL_LOGS_TABLE_HEADING);
        const oTableSearchField = new sap.m.SearchField({ placeholder: Globals.SEARCH_REGEX_PLACEHOLDER, showSearchButton: false });
        oTableSearchField.setWidth('15%')
                         .attachLiveChange((oEvent) => {
                             thisView.onSearchPollLogs(oEvent);
                         });

        oTableHeaderToolbar.addContent(oTableLabel);
        oTableHeaderToolbar.addContent(new sap.m.ToolbarSpacer());
        oTableHeaderToolbar.addContent(oTableSearchField);

        oTable.setHeaderToolbar(oTableHeaderToolbar);
    },

    onSearchPollLogs: function(oEvent) {
        const sQuery = oEvent.getSource().getValue();
        let oRegExp = new RegExp('^$', 'i');
        try {
            oRegExp = new RegExp(sQuery, 'i');
        } catch (e) {
            // welp, invalid regex - we'll just keep using the default one
        }

        const oTable = sap.ui.getCore().byId(UIComponents.POLL_LOGS_TABLE);
        const aTableRows = oTable.getItems();
        let iLogsShown = 0;
        for(const oRow of aTableRows) {
            const aCells = oRow.getCells();
            const aStringsToLookForMatches = [aCells[0].getText(), aCells[1].getText()];
            let bShowRow = false;
            for(const s of aStringsToLookForMatches) {
                if(s.match(oRegExp)) {
                    bShowRow = true;
                    iLogsShown++;
                    break;
                }
            }
            oRow.setVisible(bShowRow);
        }
        this.setPollLogsTableHeaderText(iLogsShown);
    },

    setPollLogsTableHeaderText: function(iLogsShown) {
        const oHeaderText = sap.ui.getCore().byId(UIComponents.POLL_LOGS_TABLE_HEADING);
        oHeaderText.setText(Globals.POLL_LOGS_TABLE_HEADER_LOGS_COUNT_PREFIX + iLogsShown + ')');
    },

    createPollLogaTableColumns: function(oTable) {
        const oTimestampColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oTimestampColumn.setWidth('15%')
                        .setHeader(new sap.m.Text({ text: Globals.TIMESTAMP_TITLE }));

        const oMessageColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oMessageColumn.setWidth('85%')
                      .setHeader(new sap.m.Text({ text: Globals.MESSAGE_TITLE }));

        oTable.addColumn(oTimestampColumn);
        oTable.addColumn(oMessageColumn);
    },

    loadPage: function() {
        this.resetPage();
        this.getController().pageLoaded();
    },

    resetPage: function() {
        const oTable = sap.ui.getCore().byId(UIComponents.POLL_LOGS_TABLE);

        if(oTable.getItems()) {
            oTable.destroyItems();
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
        const oErrorDialog = sap.ui.getCore().byId(UIComponents.POLL_LOGS_ERROR_DIALOG);
        const oErrorDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLL_LOGS_ERROR_DIALOG_MESSAGE_STRIP);

        if(sMessage) {
            oErrorDialogMessageStrip.setText(sMessage);
            oErrorDialog.open();
        }
    },

    applyViewSpecificObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aLogs = oModel.getLogs();

        if(aLogs) {
            this.addLogsToTable(aLogs);
        }
    },

    addLogsToTable(aLogs) {
        const oTable = sap.ui.getCore().byId(UIComponents.POLL_LOGS_TABLE);
        const oController = this.getController();

        this.setPollLogsTableHeaderText(aLogs.length);

        for(const oLog of aLogs) {
            const oRow = new sap.m.ColumnListItem({ vAlign: sap.ui.core.VerticalAlign.Middle });
            oRow.addCell(new sap.m.Text({ text: oLog.timestamp }))
                .addCell(new sap.m.Text({ text: oLog.message }));
            oTable.addItem(oRow);
        }

        this.getController().setAppBusy(false);
    }
});