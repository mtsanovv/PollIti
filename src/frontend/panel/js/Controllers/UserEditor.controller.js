sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_USER_EDITOR, {
        pageLoaded: function() {
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            if(oModel.isUserUpdate() && oModel.getInitialUsername()) {
                this.fetchAgentDetails();
            }
        },

        fetchAgentDetails: function() {
            const thisController = this;
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const sEndpoint = [Config.API_BASE_URL, Globals.USERS_ENDPOINT, oModel.getInitialUsername()].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(oUser) {
                    oModel.setUsername(oUser.username);
                    oModel.setDisplayName(oUser.displayName);
                    oModel.setAgentAccountEnabled(oUser.enabled);
                    thisController.passModel(oModel);
                },
                error: function(oJqXhr)
                {
                    if(oJqXhr.readyState != 4 || (oJqXhr.status != 404 && oJqXhr.status != 401)) {
                        // network error or http status different than 404 and 401
                        thisController.errorOccurred(ValidationMessages.UNEXPECTED_SERVER_RESPONSE);
                    } else if(oJqXhr.status == 404) {
                        const sErrorMessage = thisController.createCompositeErrorMessage(oJqXhr.responseText);
                        thisController.errorOccurred(sErrorMessage);
                    } else {
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                    thisController.setAppBusy(false);
                }
            });
        },

        submitAgentDetails: function() {
            const thisController = this;
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const sEndpoint = this.getSubmitEndpoint();
            const sHttpVerb = this.getSubmitHttpVerb();
            const oRequestBody = this.getSubmitRequestBody();

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
            const sAgentUsername = oModel.getUsername();
            const sAgentInitialUsername = oModel.getInitialUsername();
            const sAgentPassword = oModel.getPassword();

            const oRequestBody = {
                displayName: oModel.getDisplayName(),
                enabled: oModel.isAgentAccountEnabled()
            };

            if(sAgentPassword) {
                oRequestBody['password'] = sAgentPassword;
            }

            if(sAgentInitialUsername != sAgentUsername) {
                // the initial username when creating a new user is '', so this will also work when creating a new user
                oRequestBody['username'] = sAgentUsername;
            }

            return oRequestBody;
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