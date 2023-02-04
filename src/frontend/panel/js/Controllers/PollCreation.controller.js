sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_POLL_CREATION, {
        submitPoll: function() {
            const thisController = this;
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT].join(Globals.URI_DELIMITER);;
            const oRequestBody = this.getSubmitRequestBody();

            $.ajax({
                type: 'POST',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(oRequestBody),
                contentType: Globals.POLLITI_BACKEND_REQUEST_CONTENT_TYPE,
                success: function(oResult) {
                    oModel.setId(oResult.id);
                    thisController.passModel(oModel);
                },
                error: function(oJqXhr) {
                    if(oJqXhr.readyState != 4 || (oJqXhr.status != 400 && oJqXhr.status != 401)) {
                        // network error or http status different than 400 and 401
                        thisController.errorOccurred(ValidationMessages.UNEXPECTED_SERVER_RESPONSE);
                    } else if(oJqXhr.status == 400) {
                        const sErrorMessage = thisController.createCompositeErrorMessage(oJqXhr.responseText);
                        thisController.errorOccurred(sErrorMessage, true);
                    } else {
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                }
            });
        },

        getSubmitRequestBody: function() {
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);

            const oRequestBody = {
                title: oModel.getTitle(),
                threshold: oModel.getThresholdPercentage(),
                options: oModel.getOptions()
            };

            return oRequestBody;
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