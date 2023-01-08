sap.ui.jsview(UIComponents.POLLITI_VIEW_MAIN, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_MAIN
    },

    createContent: function() {
        const oToolPage = new sap.tnt.ToolPage(UIComponents.POLLITI_PAGE_MAIN, { sideExpanded: false });

        this.createToolPageHeader(oToolPage);
        this.createToolPageSideContent(oToolPage);
        this.createToolPageMainContent(oToolPage);

        return oToolPage;
    },

    createToolPageHeader(oToolPage) {
        const oToolPageHeader = new sap.tnt.ToolHeader();

        this.createSideNavToggleButton(oToolPage, oToolPageHeader);
        this.createTitle(oToolPageHeader);
        this.createLogoutButton(oToolPageHeader);

        oToolPage.setHeader(oToolPageHeader);
    },

    createSideNavToggleButton: function(oToolPage, oToolPageHeader) {
        const oSideNavToggleButton = new sap.m.Button(UIComponents.SIDE_NAV_TOGGLE_BUTTON, { icon: 'sap-icon://menu2', type: 'Transparent' });
        oSideNavToggleButton.attachPress(() => {
            oToolPage.toggleSideContentMode();
        });

        const oButtonLayoutData = new sap.ui.core.LayoutData({
            layoutData: new sap.m.OverflowToolbarLayoutData({ priority: 'NeverOverflow' })
        });

        oSideNavToggleButton.setLayoutData(oButtonLayoutData);
        oToolPageHeader.addContent(oSideNavToggleButton);
    },

    createLogoutButton: function(oToolPageHeader) {
        const oController = this.getController();
        const oLogoutButton =  new sap.m.Button(UIComponents.LOGOUT_BUTTON, { icon: 'sap-icon://log', type: 'Transparent', tooltip: Globals.LOGOUT_BUTTON_TOOLTIP });
        oLogoutButton.attachPress(() => {
            oController.attemptLogout();
        });
        const oButtonLayoutData = new sap.ui.core.LayoutData({
            layoutData: new sap.m.OverflowToolbarLayoutData({ priority: 'NeverOverflow' })
        });
        oLogoutButton.setLayoutData(oButtonLayoutData);
        oToolPageHeader.addContent(oLogoutButton);
    },

    createTitle: function(oToolPageHeader) {
        oToolPageHeader.addContent(new sap.m.ToolbarSpacer());
        oToolPageHeader.addContent(new sap.m.Title({ text: Config.AGENCY_NAME, level: 'H1', textAlign: sap.ui.core.TextAlign.Center }));
        oToolPageHeader.addContent(new sap.m.ToolbarSpacer());
    },

    createToolPageSideContent: function(oToolPage) {
        const oToolPageSideNav = new sap.tnt.SideNavigation(UIComponents.SIDE_NAV);
        const oSideNavList = new sap.tnt.NavigationList();

        for(const oItem of Globals.NAV_CONTENT) {
            if(oItem.launchpadOnly) {
                continue;
            }
            const sItemLink = ['#', oItem.route].join(Globals.URI_DELIMITER);
            oSideNavList.addItem(new sap.tnt.NavigationListItem(oItem.id, { icon: oItem.icon, text: oItem.text, href: sItemLink }).setKey(oItem.id));
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