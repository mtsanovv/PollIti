sap.ui.jsview(UIComponents.POLLITI_VIEW_USERS_LISTING, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_USERS_LISTING;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_USERS_LISTING, { title: Globals.POLLITI_PAGE_USERS_LISTING_TITLE, showNavButton: true });
        oPage.attachNavButtonPress(() => {
            oController.navToPrevious();
        });

        this.createUserDeletionDialog(oPage);
        this.createUsersListingTable(oPage);

        return oPage;
    },

    createUserDeletionDialog: function(oPage) {
        const thisView = this;
        const oController = this.getController();
        const oUserDeletionDialog = new sap.m.Dialog(UIComponents.USERS_LISTING_USER_DELETION_DIALOG, {
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });
        oUserDeletionDialog.setBusyIndicatorDelay(0);

        const oUserDeletionDialogMessageStrip = new sap.m.MessageStrip(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_MESSAGE_STRIP, {
            type: sap.ui.core.MessageType.Warning,
            showIcon: true
        });
        oUserDeletionDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');

        const oDialogYesButton = new sap.m.Button(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_YES_BUTTON, {
            text: Globals.DIALOG_YES_BUTTON_TEXT,
            type: sap.m.ButtonType.Success  
        });
        oDialogYesButton.attachPress(() => {
            oUserDeletionDialog.setBusy(true);
            oController.tryDeleteUser();
        });

        const oDialogNoButton = new sap.m.Button(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_NO_BUTTON, {
            text: Globals.DIALOG_NO_BUTTON_TEXT,
            type: sap.m.ButtonType.Negative  
        });
        oDialogNoButton.attachPress(() => {
            oUserDeletionDialog.close();
        });

        const oDialogDismissButton = new sap.m.Button(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_DISMISS_BUTTON, {
            text: Globals.DIALOG_DISMISS_BUTTON_TEXT,
            type: sap.m.ButtonType.Emphasized  
        });
        oDialogDismissButton.attachPress(() => {
            oUserDeletionDialog.close();
            oController.setAppBusy(true);
            thisView.loadPage();
        });

        oUserDeletionDialog.addContent(oUserDeletionDialogMessageStrip);
        oUserDeletionDialog.addButton(oDialogYesButton);
        oUserDeletionDialog.addButton(oDialogNoButton);
        oUserDeletionDialog.addButton(oDialogDismissButton);

        oPage.addContent(oUserDeletionDialog);
    },

    createUsersListingTable: function(oPage) {
        const oTable = new sap.m.Table(UIComponents.USERS_LISTING_TABLE);
        oTable.addStyleClass('sapUiResponsiveMargin')
              .setWidth('auto');

        this.createUsersListingTableHeader(oTable);
        this.createUsersListingTableColumns(oTable);

        oPage.addContent(oTable);
    },

    createUsersListingTableHeader: function(oTable) {
        const thisView = this;
        const oController = this.getController();
        const oUsersListingTableHeaderToolbar = new sap.m.Toolbar();
        const oUsersListingTableLabel = new sap.m.Label(UIComponents.USERS_LISTING_TABLE_HEADING);
        const oUsersListingTableSearchField = new sap.m.SearchField({ showSearchButton: false });
        oUsersListingTableSearchField.setWidth('10%')
                                     .attachLiveChange((oEvent) => {
                                         thisView.onSearchUsersListing(oEvent);
                                     });

        const oCreateUserButton = new sap.m.Button({ icon: 'sap-icon://add', text: Globals.CREATE_USER_BUTTON_TEXT });
        oCreateUserButton.attachPress(() => {
            oController.navTo(Globals.NAV_CREATE_USER);
        });

        oUsersListingTableHeaderToolbar.addContent(oUsersListingTableLabel);
        oUsersListingTableHeaderToolbar.addContent(new sap.m.ToolbarSpacer());
        oUsersListingTableHeaderToolbar.addContent(oUsersListingTableSearchField);
        oUsersListingTableHeaderToolbar.addContent(oCreateUserButton);

        oTable.setHeaderToolbar(oUsersListingTableHeaderToolbar);
    },

    onSearchUsersListing: function(oEvent) {
        const sQuery = Globals.escapeRegex(oEvent.getSource().getValue());
        const oTable = sap.ui.getCore().byId(UIComponents.USERS_LISTING_TABLE);
        const aTableRows = oTable.getItems();
        let iUsersShown = 0;
        for(const oRow of aTableRows) {
            const aCells = oRow.getCells();
            const aStringsToLookForMatches = [aCells[0].getText(), aCells[1].getText()];
            let bShowRow = false;
            for(const s of aStringsToLookForMatches) {
                if(s.match(new RegExp('(' + sQuery + ')+', 'i'))) {
                    bShowRow = true;
                    iUsersShown++;
                    break;
                }
            }
            oRow.setVisible(bShowRow);
        }
        this.setUsersListingTableHeaderText(iUsersShown);
    },

    setUsersListingTableHeaderText: function(iUsersShown) {
        const oHeaderText = sap.ui.getCore().byId(UIComponents.USERS_LISTING_TABLE_HEADING);
        oHeaderText.setText(Globals.USERS_LISTING_TABLE_HEADER_USERS_COUNT_PREFIX + iUsersShown + ')');
    },

    createUsersListingTableColumns: function(oTable) {
        const oUsernameColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oUsernameColumn.setWidth('20%')
                       .setHeader(new sap.m.Text({ text: Globals.USERNAME_TITLE }));
        const oDisplayNameColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle });
        oDisplayNameColumn.setWidth('35%')
                          .setHeader(new sap.m.Text({ text: Globals.DISPLAY_NAME_TITLE }));
        const oActionsColumn = new sap.m.Column({ vAlign: sap.ui.core.VerticalAlign.Middle, hAlign: sap.ui.core.TextAlign.Center });
        oActionsColumn.setWidth('45%')
                      .setHeader(new sap.m.Text({ text: Globals.ACTIONS_TITLE }));

        oTable.addColumn(oUsernameColumn);
        oTable.addColumn(oDisplayNameColumn);
        oTable.addColumn(oActionsColumn);
    },

    loadPage: function() {
        this.resetPage();
        this.getController().pageLoaded();
    },

    resetPage: function() {
        const oUserDeletionDialog = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG);
        const oUsersListingTable = sap.ui.getCore().byId(UIComponents.USERS_LISTING_TABLE);

        if(oUserDeletionDialog.isBusy()) {
            oUserDeletionDialog.setBusy(false);
        }

        if(oUserDeletionDialog.isOpen()) {
            oUserDeletionDialog.close();
        }

        if(oUsersListingTable.getItems()) {
            oUsersListingTable.destroyItems();
        }
    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        this.applyBaseObjectModel();
        if(!oModel.isBaseObjectModel()) {
            this.applyViewSpecificObjectModel();
        }
    },

    applyBaseObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();

        if(sMessage) {
            this.showUserDeletionError(sMessage);
        }
    },

    applyViewSpecificObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const aUsers = oModel.getUsers();

        if(aUsers) {
            this.addUsersToTable(aUsers);
        }
    },

    addUsersToTable(aUsers) {
        const oController = this.getController();
        const oTable = sap.ui.getCore().byId(UIComponents.USERS_LISTING_TABLE);

        this.setUsersListingTableHeaderText(aUsers.length);

        for(const oUser of aUsers) {
            const oRow = new sap.m.ColumnListItem({ vAlign: sap.ui.core.VerticalAlign.Middle });
            oRow.setType(sap.m.ListType.Navigation)
                .attachPress(() => {
                    oController.navigateToUserDetails(oUser.username);
                })
                .addCell(new sap.m.Text({ text: oUser.username }))
                .addCell(new sap.m.Text({ text: oUser.displayName }));
            this.addUserActionButtonsCellToRow(oRow, oUser);
            oTable.addItem(oRow);
        }

        this.getController().setAppBusy(false);
    },

    addUserActionButtonsCellToRow: function(oRow, oUser) {
        const thisView = this;
        const oController = this.getController();
        const oUserActionButtonsWrapper = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, justifyContent: sap.m.FlexJustifyContent.Center });
        oUserActionButtonsWrapper
        oRow.addCell(oUserActionButtonsWrapper); // so that the navigation arrow of the row is always on the right, even for rows without actions

        if(oUser.role == Globals.ROLES.Administrator) {
            return;
        }

        const oEditUserButton = new sap.m.Button({ icon: 'sap-icon://user-edit', text:  Globals.UPDATE_USER_BUTTON_TEXT, type: sap.m.ButtonType.Attention });
        oEditUserButton.addStyleClass('sapUiTinyMarginEnd')
                       .attachPress(() => {
                           oController.navigateToUpdateUser(oUser.username);
                       });
        const oDeleteUserButton = new sap.m.Button({ icon: 'sap-icon://delete', text: Globals.DELETE_USER_BUTTON_TEXT, type: sap.m.ButtonType.Reject });
        oDeleteUserButton.addStyleClass('sapUiTinyMarginBeginEnd')
                         .attachPress(() => {
                             thisView.showUserDeletionDialog(oUser.username, oUser.displayName);
                         });

        oUserActionButtonsWrapper.addItem(oEditUserButton);
        oUserActionButtonsWrapper.addItem(oDeleteUserButton);
    },

    showUserDeletionDialog: function(sUsername, sDisplayName) {
        const oDialog = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_MESSAGE_STRIP);
        const oDialogYesButton = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_YES_BUTTON);
        const oDialogNoButton = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_NO_BUTTON);
        const oDialogDismissButton = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_DISMISS_BUTTON);

        this.setObjectModel(new UsersListingObjectModel({
            usernameToDelete: sUsername
        }));

        oDialog.setTitle(Globals.USERS_LISTING_USER_DELETION_DIALOG_TITLE_PREFIX + sDisplayName + "'");
        oDialogMessageStrip.setType(sap.ui.core.MessageType.Warning);
        oDialogMessageStrip.setText("Are you sure that you want to delete the user '" + sDisplayName + "' (" + sUsername + ")?\n\nThis action cannot be undone.");

        oDialogYesButton.setVisible(true);
        oDialogNoButton.setVisible(true);
        oDialogDismissButton.setVisible(false);

        oDialog.open();
    },

    showUserDeletionError: function(sMessage) {
        const oDialog = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG);
        const oDialogMessageStrip = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_MESSAGE_STRIP);
        const oDialogYesButton = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_YES_BUTTON);
        const oDialogNoButton = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_NO_BUTTON);
        const oDialogDismissButton = sap.ui.getCore().byId(UIComponents.USERS_LISTING_USER_DELETION_DIALOG_DISMISS_BUTTON);

        oDialog.setTitle(Globals.ERROR_DIALOG_TITLE);
        oDialogMessageStrip.setType(sap.ui.core.MessageType.Error);
        oDialogMessageStrip.setText(sMessage);

        oDialogYesButton.setVisible(false);
        oDialogNoButton.setVisible(false);
        oDialogDismissButton.setVisible(true);

        oDialog.setBusy(false);
    },

    setObjectModel: function(oObjectModel) {
        const oModel = {
            [Globals.MODEL_PATH_KEY]: oObjectModel
        };
        this.setModel(new sap.ui.model.json.JSONModel(oModel));
    },
});