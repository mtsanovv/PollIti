sap.ui.jsview(UIComponents.POLLITI_VIEW_MAIN, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_MAIN
    },

    createContent: function(oController) {
        const oToolPage = new sap.tnt.ToolPage(UIComponents.POLLITI_PAGE_MAIN, { sideExpanded: false });

        this.createChangeThemeDialog();
        this.createToolPageHeader(oToolPage);
        this.createToolPageSideContent(oToolPage);
        this.createToolPageMainContent(oToolPage);

        return oToolPage;
    },

    createChangeThemeDialog: function(oToolPage) {
        const oChangeThemeDialog = new sap.m.Dialog(UIComponents.CHANGE_THEME_DIALOG, { title: Globals.CHANGE_THEME_DIALOG_TITLE, icon: 'sap-icon://palette' });
        const oThemeList = this.createThemeList(oChangeThemeDialog);
        const oCloseButton = new sap.m.Button(UIComponents.CHANGE_THEME_DIALOG_CLOSE_BUTTON, { text: Globals.CHANGE_THEME_DIALOG_BUTTON_TEXT, type: sap.m.ButtonType.Emphasized });
        oCloseButton.attachPress(() => { 
            oChangeThemeDialog.close();
        });
    
        oChangeThemeDialog.addContent(oThemeList);
        oChangeThemeDialog.addButton(oCloseButton);
        oToolPage.addMainContent(oChangeThemeDialog);
    },

    createChangeThemeDialogThemeList: function(oChangeThemeDialog) {
        const oController = this.getController();
        const oThemeList = new sap.m.List(UIComponents.CHANGE_THEME_DIALOG_LIST);

        for(const oTheme of Globals.THEMES) {
            const oThemeItem = new sap.m.StandardListItem({ title: oTheme.name });
            oThemeItem.setType(sap.m.ListType.Active);
            oThemeItem.attachPress(() => {
                oController.themeChanged(oThemeList.id);
                oChangeThemeDialog.close();
            });
            oThemeList.addItem(oThemeItem);
        }

        return oThemeList;
    },

    createToolPageHeader(oToolPage) {
        const oToolPageHeader = new sap.tnt.ToolHeader();

        this.createSideNavToggleButton(oToolPage, oToolPageHeader);
        this.createTitle(oToolPageHeader);
        this.createChangeThemeButton(oToolPageHeader);

        oToolPage.setHeader(oToolPageHeader);
    },

    createSideNavToggleButton: function(oToolPage, oToolPageHeader) {
        const oSideNavToggleButton = new sap.m.Button(SIDE_NAV_TOGGLE_BUTTON, { icon: 'sap-icon://menu2', type: 'Transparent' });
        oSideNavToggleButton.attachPress(() => {
            oToolPage.toggleSideContentMode();
        });

        const oButtonLayoutData = new sap.ui.core.LayoutData({
            layoutData: new sap.m.OverflowToolbarLayoutData({ priority: 'NeverOverflow' })
        });

        oSideNavToggleButton.setLayoutData(oButtonLayoutData);
        oToolPageHeader.addContent(oSideNavToggleButton);
    },

    createTitle: function(oToolPageHeader) {
        oToolPageHeader.addContent(new sap.m.ToolbarSpacer());
        oToolPageHeader.addContent(new sap.m.Title({ text: Config.AGENCY_NAME, level: 'H1', textAlign: sap.ui.core.TextAlign.Center }));
        oToolPageHeader.addContent(new sap.m.ToolbarSpacer());
    },

    createChangeThemeButton: function(oToolPageHeader) {
        const thisView = this;
        const oChangeThemeButton = new sap.m.Button({ icon: 'sap-icon://palette', type: 'Transparent', tooltip: Globals.CHANGE_THEME_BUTTON_TOOLTIP });
        oChangeThemeButton.attachPress(() => {
            thisView.changeThemeClicked();
        });

        const oButtonLayoutData = new sap.ui.core.LayoutData({
            layoutData: new sap.m.OverflowToolbarLayoutData({ priority: 'NeverOverflow' })
        });

        oChangeThemeButton.setLayoutData(oButtonLayoutData);
        oToolPageHeader.addContent(oChangeThemeButton);
    },

    changeThemeClicked: function() {
        const oStorage =  jQuery.sap.storage(jQuery.sap.storage.Type.local);
        const sSavedThemeId = oStorage.get(Globals.SAVED_THEME_STORAGE_PREFIX); 
        const oChangeThemeDialog = sap.ui.getCore().byId(UIComponents.CHANGE_THEME_DIALOG);
        const aChangeThemeDialogListItems = sap.ui.getCore().byId(UIComponents.CHANGE_THEME_DIALOG_LIST).getItems();
        let iSelectedThemeIndex = 0;

        for(let i = 0; i < Globals.THEMES.length; i++) {
            if(Globals.THEMES[i].id == sSavedThemeId) {
                iSelectedThemeIndex = i;
                break;
            }
        }

        for(let i = 0; i < aChangeThemeDialogListItems.length; i++) {
            if(i == iSelectedThemeIndex) {
                aChangeThemeDialogListItems[i].setIcon('sap-icon://sys-enter-2');
                continue;
            }
            aChangeThemeDialogListItems[i].setIcon(null);
        }

        oChangeThemeDialog.open();
    },

    createToolPageSideContent: function(oToolPage) {
        const oToolPageSideNav = new sap.tnt.SideNavigation(UIComponents.SIDE_NAV);
        const oSideNavList = new sap.tnt.NavigationList();

        for(const oItem of Globals.SIDE_NAV_CONTENT) {
            oSideNavList.addItem(new sap.tnt.NavigationListItem(oItem.id, { icon: oItem.icon, text: oItem.text, href: '#/' + oItem.route })).setKey(oItem.id);
        }

        oToolPageSideNav.setItem(oSideNavList);
        oToolPage.setSideContent(oToolPageSideNav);
    },

    createToolPageMainContent: function(oToolPage) {
        const oApp = new sap.m.App(UIComponents.POLLITI_APP);
        oApp.setBusyIndicatorDelay(0);
        oToolPage.addMainContent(oApp);
    }
});