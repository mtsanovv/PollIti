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
            const thisController = this;
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const sEndpoint = this.getSubmitEndpoint();
            const sHttpVerb = this.getSubmitHttpVerb();
            const oRequestBody = {
                username: oModel.getUsername(),
                displayName: oModel.getDisplayName(),
                password: oModel.getPassword(),
                enabled: oModel.isAgentAccountEnabled()
            };

            $.ajax({
                type: sHttpVerb,
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(oRequestBody),
                contentType: Globals.POLLITI_BACKEND_REQUEST_CONTENT_TYPE,
                success: function() {
                    oModel.setIsSuccess(true);
                    thisController.passModel(oModel);
                    sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_SUBMIT_BUTTON).setBusy(false);
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
                    sap.ui.getCore().byId(UIComponents.USER_EDITOR_FORM_SUBMIT_BUTTON).setBusy(false);
                }
            });
        },

        getSubmitHttpVerb: function() {
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            if(!oModel.isUserUpdate()) {
                return 'POST';
            }
            return 'PATCH';
        },

        getSubmitEndpoint: function() {
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);

            if(!oModel.isUserUpdate()) {
                return [Config.API_BASE_URL, Globals.USERS_ENDPOINT].join(Globals.URI_DELIMITER);
            }

            return [Config.API_BASE_URL, Globals.USERS_ENDPOINT, oModel.getInitialUsername()].join(Globals.URI_DELIMITER);
        },

        // Override
        errorOccurred: function(sMessage, bIsDismissableErrorMessage = false) {
            // UserEditor cannot make use of the basic object model due to the fact that it does not contain information whether this is an update or create page
            // also the model should never be replaced due to the fact that it contains information that has to be preserved when it's passed around
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            oModel.setMessage(sMessage);
            oModel.setIsErrorMessageDismissable(bIsDismissableErrorMessage);
            oModel.setIsSuccess(false);
            this.passModel(oModel);
        }
    });
});