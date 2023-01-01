sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function (Controller) {
    'use strict';

    return Controller.extend(UIComponents.POLLITI_CONTROLLER_BASE, {
        toggleMainPageNav: function(bToggle) {

        },

        getMainController: function() {
            return sap.ui.getCore().byId(UIComponents.POLLITI_VIEW_MAIN).getController();
        },

        navToPrevious: function() {
            const oComponentModel  = this.getMainController().getOwnerComponent().getModel();
            const aRouteHistory = oComponentModel.getProperty(Globals.ROUTE_HISTORY_MODEL_PATH);
            aRouteHistory.splice(aRouteHistory.length - 1, 1); // remove the current route from the route history
            const oPrevRoute = aRouteHistory.pop();
            let sRoute = Globals.NAV_LOGIN; // default route is the login page
            let oArgs;

            if(oPrevRoute) {
                sRoute = oPrevRoute.route;
                oArgs = oPrevRoute.arguments;
                
                if(sRoute == this.getMainController().getCurrentRouteName()) {
                    sRoute = Globals.NAV_LOGIN; // in case the previous route name was also this one (for some odd reason), go back to login
                }
            }

            this.navTo(sRoute, oArgs);
        },

        navTo: function(sRoute, oArgs) {
            this.getMainController().getRouter().navTo(sRoute, oArgs);
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