sap.ui.jsview(UIComponents.POLLITI_VIEW_POLLS_LISTING, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_POLLS_LISTING;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_POLLS_LISTING, { title: Globals.POLLITI_PAGE_POLLS_LISTING_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => {
            oController.navToPrevious();
        });

        this.createErrorDialog(oPage);
        this.createPollsListingTable(oPage);

        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oController = this.getController();
        const oErrorDialog = new sap.m.Dialog(UIComponents.POLLS_LISTING_ERROR_DIALOG, {
            title: Globals.ERROR_DIALOG_TITLE,
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });

        const oErrorDialogMessageStrip = new sap.m.MessageStrip(UIComponents.POLLS_LISTING_ERROR_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.Error, showIcon: true });
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

    createPollsListingTable: function(oPage) {
        const oTable = new sap.m.Table(UIComponents.POLLS_LISTING_TABLE);
        oTable.addStyleClass('sapUiResponsiveMargin')
              .setWidth('auto');

        this.createPollsListingTableHeader(oTable);
        this.createPollsListingTableColumns(oTable);

        oPage.addContent(oTable);
    },

    createPollsListingTableHeader: function(oTable) {
        const thisView = this;
        const oController = this.getController();
        const oPollsListingTableHeaderToolbar = new sap.m.Toolbar();
        const oPollsListingTableLabel = new sap.m.Label(UIComponents.POLLS_LISTING_TABLE_HEADING);
        const oPollsListingTableSearchField = new sap.m.SearchField({ showSearchButton: false });
        oPollsListingTableSearchField.setWidth('10%')
                                     .attachLiveChange((oEvent) => {
                                         thisView.onSearchPollsListing(oEvent);
                                     });

        const oCreatePollButton = new sap.m.Button({ icon: 'sap-icon://add', text: Globals.ADD_BUTTON_TEXT });
        oCreatePollButton.attachPress(() => {
            oController.navTo(Globals.NAV_CREATE_POLL);
        });

        oPollsListingTableHeaderToolbar.addContent(oPollsListingTableLabel);
        oPollsListingTableHeaderToolbar.addContent(new sap.m.ToolbarSpacer());
        oPollsListingTableHeaderToolbar.addContent(oPollsListingTableSearchField);
        oPollsListingTableHeaderToolbar.addContent(oCreatePollButton);

        oTable.setHeaderToolbar(oPollsListingTableHeaderToolbar);
    },

    onSearchPollsListing: function(oEvent) {
        const sQuery = Globals.escapeRegex(oEvent.getSource().getValue());
        const oTable = sap.ui.getCore().byId(UIComponents.POLLS_LISTING_TABLE);
        const aTableRows = oTable.getItems();
        let iPollsShown = 0;
        for(const oRow of aTableRows) {
            const aCells = oRow.getCells();
            const aStringsToLookForMatches = [aCells[0].getText(), aCells[1].getText()];
            let bShowRow = false;
            for(const s of aStringsToLookForMatches) {
                if(s.match(new RegExp('(' + sQuery + ')+', 'i'))) {
                    bShowRow = true;
                    iPollsShown++;
                    break;
                }
            }
            oRow.setVisible(bShowRow);
        }
        this.setPollsListingTableHeaderText(iPollsShown);
    },

    setPollsListingTableHeaderText: function(iPollsShown) {
        const oHeaderText = sap.ui.getCore().byId(UIComponents.POLLS_LISTING_TABLE_HEADING);
        oHeaderText.setText(Globals.POLLS_LISTING_TABLE_HEADER_POLLS_COUNT_PREFIX + iPollsShown + ')');
    },

    createPollsListingTableColumns: function(oTable) {
        const oIdColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oIdColumn.setWidth('10%')
                 .setHeader(new sap.m.Text({ text: Globals.ID_TITLE }));
        const oPollTitleColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oPollTitleColumn.setWidth('90%')
                        .setHeader(new sap.m.Text({ text: Globals.POLL_TITLE_TITLE }));

        oTable.addColumn(oIdColumn);
        oTable.addColumn(oPollTitleColumn);
    },

    loadPage: function() {
        this.resetPage();
        this.getController().pageLoaded();
    },

    resetPage: function() {
        const oPollsListingTable = sap.ui.getCore().byId(UIComponents.POLLS_LISTING_TABLE);

        if(oPollsListingTable.getItems()) {
            oPollsListingTable.destroyItems();
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
        const oErrorDialog = sap.ui.getCore().byId(UIComponents.POLLS_LISTING_ERROR_DIALOG);
        const oErrorDialogMessageStrip = sap.ui.getCore().byId(UIComponents.POLLS_LISTING_ERROR_DIALOG_MESSAGE_STRIP);

        if(sMessage) {
            oErrorDialogMessageStrip.setText(sMessage);
            oErrorDialog.open();
        }
    },

    applyViewSpecificObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aPolls = oModel.getPolls();

        if(aPolls) {
            this.addPollsToTable(aPolls);
        }
    },

    addPollsToTable(aPolls) {
        const oTable = sap.ui.getCore().byId(UIComponents.POLLS_LISTING_TABLE);
        const oController = this.getController();

        this.setPollsListingTableHeaderText(aPolls.length);

        for(const oPoll of aPolls) {
            const oRow = new sap.m.ColumnListItem({ vAlign: sap.ui.core.VerticalAlign.Middle });
            oRow.setType(sap.m.ListType.Navigation)
                .attachPress(() => {
                    oController.navigateToPollDetails(oPoll.id);
                })
                .addCell(new sap.m.Text({ text: oPoll.id }))
                .addCell(new sap.m.Text({ text: oPoll.title }));
            oTable.addItem(oRow);
        }

        this.getController().setAppBusy(false);
    },

    setObjectModel: function(oObjectModel) {
        const oModel = {
            [Globals.MODEL_PATH_KEY]: oObjectModel
        };
        this.setModel(new sap.ui.model.json.JSONModel(oModel));
    },
});