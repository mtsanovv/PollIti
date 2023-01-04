sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_LAUNCHPAD, {
        pageLoaded: function() {
            
        },

        errorOccurred: function(sMessage) {
            const oModelData = {
                message: sMessage
            };
            this.passModel(new LaunchpadObjectModel(oModelData));
        }
    });
});