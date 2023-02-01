sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function (Controller) {
    'use strict';

    return Controller.extend(UIComponents.POLLITI_CONTROLLER_BASE, {
        showMainPageNav: function(bToggle) {
            sap.ui.getCore().byId(UIComponents.SIDE_NAV_TOGGLE_BUTTON).setVisible(bToggle);
            sap.ui.getCore().byId(UIComponents.SIDE_NAV).setVisible(bToggle);
        },

        showLogoutButton: function(bToggle) {
            sap.ui.getCore().byId(UIComponents.LOGOUT_BUTTON).setVisible(bToggle);
        },

        getCurrentRouteName: function() {
            const oRouter = this.getFirstChildViewController().getRouter();
            const sCurrentHash = oRouter.getHashChanger().getHash();
            const oRouteInfo = oRouter.getRouteInfoByHash(sCurrentHash);
            return oRouteInfo && oRouteInfo.name != Globals.NAV_HOME ? oRouteInfo.name : Globals.NAV_LAUNCHPAD; 
        },

        getCurrentRouteArguments: function() {
            const oRouter = this.getFirstChildViewController().getRouter();
            const sCurrentHash = oRouter.getHashChanger().getHash();
            return oRouter.getRouteInfoByHash(sCurrentHash).arguments;
        },

        getFirstChildViewController: function() {
            // trying to get POLLITI_VIEW_MAIN from child controllers yields an error
            // thus, our best bet is the first child view (that is, the login) because it is the only view that contains a reference to the owner component
            return sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_LOGIN).getController();
        },

        getApp: function() {
            return sap.ui.getCore().byId(UIComponents.POLLITI_APP);
        },

        setAppBusy: function(bToggle = true) {
            this.getApp().setBusy(bToggle);
        },

        navToPrevious: function() {
            const oComponentModel  = this.getFirstChildViewController().getOwnerComponent().getModel();
            const aRouteHistory = oComponentModel.getProperty(Globals.ROUTE_HISTORY_MODEL_PATH);
            aRouteHistory.splice(aRouteHistory.length - 1, 1); // remove the current route from the route history
            const oPrevRoute = aRouteHistory.pop();
            let sRoute = Globals.NAV_LAUNCHPAD; // default route is the launchpad page
            let oArgs;

            if(oPrevRoute) {
                sRoute = oPrevRoute.route;
                oArgs = oPrevRoute.arguments;
                
                if(sRoute == this.getFirstChildViewController().getCurrentRouteName()) {
                    sRoute = Globals.NAV_LAUNCHPAD; // in case the previous route name was also this one go back to launchpad
                }
            }

            this.navTo(sRoute, oArgs);
        },

        navTo: function(sRoute, oArgs) {
            this.getFirstChildViewController().getRouter().navTo(sRoute, oArgs);
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
        },

        errorOccurred: function(sMessage) {
            const oModelData = {
                message: sMessage
            };
            this.passModel(new ObjectModel(oModelData));
        },

        createCompositeErrorMessage: function(sResponseText) {
            const oResult = JSON.parse(sResponseText);
            const aErrorMessage = [ oResult.content.reason ];
            for(const sKey in oResult.content) {
                if(sKey != "reason") {
                    aErrorMessage.push(oResult.content[sKey]);
                }
            }
            if(aErrorMessage.length > 1) {
                // make the reason the 'header' of the error message
                aErrorMessage[0] += "\n";
            }
            return aErrorMessage.join(Globals.COMPOSITE_ERROR_MESSAGE_DELIMITER);
        },

        changeHTMLPageTitle: function(sTitle) {
            document.title = [Config.AGENCY_NAME, 'Panel', sTitle].join(Globals.HTML_PAGE_TITLE_DELIMITER);
        }
    });
});