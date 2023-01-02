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
                    thisController.getApp().setBusy(false);
                },
                error: function()
                {
                    thisController.getApp().setBusy(false);
                }
            });
        },

        loggedIn: function(sRole) {
            this.showMainPageNav(true);
            this.toggleMainPageNav(true);
            this.showLogoutButton(true);
            this.navToPrevious();
            this.filterSideNavItemsByRole(sRole);
        },

        filterSideNavItemsByRole: function(sRole) {
            const oMainPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_MAIN);
            const aSideNavItems = oMainPage.getSideContent().getItem().getItems();
            for(let i = 0; i < aSideNavItems.length; i++) {
                const oSideNavItem = aSideNavItems[i];
                const oSideNavItemModel = Globals.SIDE_NAV_CONTENT[i];
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
                    sap.ui.getCore().byId(UIComponents.LOGIN_BUTTON).setBusy(false);
                },
                error: function(oJqXhr) {
                    if(oJqXhr.readyState != 4 || oJqXhr.status != 401) {
                        // network error or http status different than 401 Unauthorized
                        thisController.errorOccurred(ValidationMessages.CONNECTION_ERROR);
                    } else {
                        const oResult = JSON.parse(oJqXhr.responseText);
                        const sReasonMessage = oResult.content.reason;
                        thisController.errorOccurred(sReasonMessage);
                    }
                    sap.ui.getCore().byId(UIComponents.LOGIN_BUTTON).setBusy(false);
                }
            });
        },

        errorOccurred: function(sMessage) {
            const oModelData = {
                message: sMessage
            };
            this.passModel(new LoginObjectModel(oModelData));
        }
    });
});