sap.ui.define([
    './BaseController'
], function (BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_MAIN, {
        onInit: function () {
            const thisController = this;
            // create all the views
            this.createViews().then(() => {
                // if there was a specific page requested initially, save it in order to go to it later
                thisController.pushCurrentRouteToRouteHistory();
                // we have saved the initially requested page, now let's clean the request URL
                // getRouter().navTo() is used instead of navTo() because in the onInit method, the view is not defined yet and getFirstChildViewController throws an error
                thisController.getRouter().navTo(Globals.NAV_HOME);
                // watch for route changes
                thisController.getRouter().attachRouteMatched(thisController.onRouteChange.bind(thisController));
                // switch to the login view when all views have been created
                thisController.getRouter().navTo(Globals.NAV_LOGIN);
            });
        },

        pushCurrentRouteToRouteHistory: function() {
            const oComponentModel = this.getOwnerComponent().getModel();
            const oNewRoute = {
                route: this.getCurrentRouteName(),
                arguments: this.getCurrentRouteArguments()
            };
            if(oComponentModel) {
                const aRouteHistory = oComponentModel.getProperty(Globals.ROUTE_HISTORY_MODEL_PATH);
                aRouteHistory.push(oNewRoute);
                return;
            }
            this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({
                    [Globals.ROUTE_HISTORY_MODEL_PROPERTY]: [oNewRoute]
                })
            );
        },

        createViews: async function() {
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_LOGIN, viewName: UIComponents.POLLITI_VIEW_LOGIN})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_LAUNCHPAD, viewName: UIComponents.POLLITI_VIEW_LAUNCHPAD})));
        },

        onRouteChange: function (oEvent) {
            const sRouteName = oEvent.getParameter('name');
            const oArgs = oEvent.getParameter('arguments');
            const oApp = this.getApp();

            switch(sRouteName) {
                case Globals.NAV_LOGIN:
                    this.showMainPageNav(false);
                    this.showLogoutButton(false);
                    oApp.setBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_LOGIN);
                    oApp.getCurrentPage().loadPage();
                    this.changeHTMLPageTitle(Globals.POLLITI_PAGE_LOGIN_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_LAUNCHPAD:
                    oApp.setBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_LAUNCHPAD);
                    oApp.getCurrentPage().loadPage();
                    this.changeHTMLPageTitle(Globals.POLLITI_PAGE_LAUNCHPAD_TITLE);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
            }
        },

        attemptLogout: function() {
            const thisController = this;
            const oLogoutButton = sap.ui.getCore().byId(UIComponents.LOGOUT_BUTTON);
            oLogoutButton.setBusy(true);

            $.ajax({
                type: 'POST',
                url: [Config.API_BASE_URL, Globals.LOGOUT_ENDPOINT].join(Globals.URI_DELIMITER),
                xhrFields: {
                    withCredentials: true
                },
                success: function() {
                    oLogoutButton.setBusy(false);
                    thisController.navTo(Globals.NAV_LOGIN);
                },
                error: function() {
                    oLogoutButton.setBusy(false);
                }
            });
        },

        changeHTMLPageTitle: function(sTitle) {
            document.title = [Config.AGENCY_NAME, 'Panel', sTitle].join(Globals.HTML_PAGE_TITLE_DELIMITER);
        },

        changeSelectedNavKey: function(sKey) {
            sap.ui.getCore().byId(UIComponents.SIDE_NAV).setSelectedKey(sKey);
        }
    });
});