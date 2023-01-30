sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_USER_EDITOR, {
        pageLoaded: function() {
            // call ajax only if bIsUserUpdate in the model is set to true
            // 401 means nav to login!!!
        },

        submitAgentDetails: function() {

        },

        // Override
        errorOccurred: function(sMessage) {
            // UserEditor cannot make use of the basic object model due to the fact that it does not contain information whether this is an update or create page
            // also the model should never be replaced due to the fact that it contains information that has to be preserved when it's passed around
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            oModel.setMessage(sMessage);
            oModel.setIsSuccess(false);
            this.passModel(oModel);
        }
    });
});