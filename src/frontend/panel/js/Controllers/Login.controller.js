sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_LOGIN, {
        pageLoaded: function() {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.ME_ENDPOINT].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(oResult) {
                    thisController.loggedIn(oResult.role);
                    // we don't set App.busy to false because we will be navigating anyway
                },
                error: function() {
                    thisController.setAppBusy(false);
                }
            });
        },

        loggedIn: function(sRole) {
            this.showMainPageNav(true);
            this.showLogoutButton(true);
            this.navToPrevious();
            this.filterSideNavItemsByRole(sRole);
        },

        filterSideNavItemsByRole: function(sRole) {
            const oMainPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_MAIN);
            const aSideNavItems = oMainPage.getSideContent().getItem().getItems();
            for(let i = 0; i < aSideNavItems.length; i++) {
                const oSideNavItem = aSideNavItems[i];
                const oSideNavItemModel = Globals.NAV_CONTENT[i];
                const aRequiredRolesForNav = oSideNavItemModel.requiredRoles;
                if(aRequiredRolesForNav && !aRequiredRolesForNav.includes(sRole)) {
                    oSideNavItem.setVisible(false);
                    continue;
                }
                if(oSideNavItem.getVisible() == false) {
                    oSideNavItem.setVisible(true);
                }
            }
        },

        getBasicAuthString: function(sUsername, sPassword) {
            return 'Basic ' + btoa([sUsername, sPassword].join(':'));
        },

        attemptLogin: function() {
            const thisController = this;
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const sUsername = oModel.getUsername();
            const sPassword = oModel.getPassword();

            $.ajax({
                type: 'POST',
                url: [Config.API_BASE_URL, Globals.LOGIN_ENDPOINT].join(Globals.URI_DELIMITER),
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(oJqXhr) {
                    oJqXhr.setRequestHeader('Authorization', thisController.getBasicAuthString(sUsername, sPassword));
                },
                success: function(oResult) {
                    thisController.loggedIn(oResult.role);
                },
                error: function(oJqXhr) {
                    if(oJqXhr.readyState != 4 || oJqXhr.status != 401) {
                        // network error or http status different than 401 Unauthorized
                        thisController.errorOccurred(ValidationMessages.CONNECTION_ERROR);
                    } else {
                        const sErrorMessage = thisController.createCompositeErrorMessage(oJqXhr.responseText);
                        thisController.errorOccurred(sErrorMessage);
                    }
                }
            });
        }
    });
});