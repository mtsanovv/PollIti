sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function (Controller) {
    'use strict';

    return Controller.extend(UIComponents.POLLITI_CONTROLLER_BASE, {
        toggleMainPageNav: function(bToggle) {
            const oMainPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_MAIN);
            sap.ui.getCore().byId(UIComponents.SIDE_NAV_TOGGLE_BUTTON).setEnabled(bToggle);
            for(const oItem of oMainPage.getSideContent().getItem().getItems()) {
                oItem.setEnabled(bToggle);
            }
        },

        showMainPageNav: function(bToggle) {
            sap.ui.getCore().byId(UIComponents.SIDE_NAV_TOGGLE_BUTTON).setVisible(bToggle);
            sap.ui.getCore().byId(UIComponents.SIDE_NAV).setVisible(bToggle);
        },

        getMainController: function() {
            return sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_MAIN).getController();
        },

        getApp: function() {
            return sap.ui.getCore().byId(UIComponents.POLLITI_APP);
        },

        navToPrevious: function() {
            const oComponentModel  = this.getMainController().getOwnerComponent().getModel();
            const aRouteHistory = oComponentModel.getProperty(Globals.ROUTE_HISTORY_MODEL_PATH);
            aRouteHistory.splice(aRouteHistory.length - 1, 1); // remove the current route from the route history
            const oPrevRoute = aRouteHistory.pop();
            let sRoute = Globals.NAV_LAUNCHPAD; // default route is the launchpad page
            let oArgs;

            if(oPrevRoute) {
                sRoute = oPrevRoute.route;
                oArgs = oPrevRoute.arguments;
                
                if(sRoute == this.getMainController().getCurrentRouteName()) {
                    sRoute = Globals.NAV_LAUNCHPAD; // in case the previous route name was also this one go back to launchpad
                }
            }

            this.navTo(sRoute, oArgs);
        },

        navTo: function(sRoute, oArgs) {
            this.getMainController().getRouter().navTo(sRoute, oArgs);
        },

        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        passModel: function(oObjectModel) {
            const oModel = {
                [Globals.MODEL_PATH_KEY]: oObjectModel
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(oModel));
            this.getView().applyModel();
        }
    });
});