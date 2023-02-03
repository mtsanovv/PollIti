sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_POLL_CREATION, {
        submitPoll: function() {

        },

        // Override
        errorOccurred: function(sMessage, bIsDismissableErrorMessage = false) {
            // the model should never be replaced due to the fact that it contains information that has to be preserved when it's passed around
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            oModel.setMessage(sMessage);
            oModel.setIsErrorMessageDismissable(bIsDismissableErrorMessage);
            this.passModel(oModel);
        }
    });
});