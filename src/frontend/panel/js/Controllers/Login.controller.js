sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_LOGIN, {
        pageLoaded: function() {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.ME_ENDPOINT].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function() {
                    thisController.loggedIn();
                    thisController.getApp().setBusy(false);
                },
                error: function()
                {
                    thisController.getApp().setBusy(false);
                }
            });
        },

        loggedIn: function() {
            this.showMainPageNav(true);
            this.toggleMainPageNav(false);
            this.showLogoutButton(true);
            this.navToPrevious();
        },

        getBasicAuthString: function(sUsername, sPassword) {
            return 'Basic ' + btoa([sUsername, sPassword].join(':'));
        },

        attemptLogin: function() {
            const thisController = this;
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const sUsername = oModel.getUsername();
            const sPassword = oModel.getPassword();

            $.ajax({
                type: 'POST',
                url: [Config.API_BASE_URL, Globals.LOGIN_ENDPOINT].join(Globals.URI_DELIMITER),
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(oJqXhr) {
                    oJqXhr.setRequestHeader('Authorization', thisController.getBasicAuthString(sUsername, sPassword));
                },
                success: function() {
                    thisController.loggedIn();
                    sap.ui.getCore().byId(UIComponents.LOGIN_BUTTON).setBusy(false);
                },
                error: function(oJqXhr) {
                    if(oJqXhr.readyState != 4 || oJqXhr.status != 401) {
                        // network error or http status different than 401 Unauthorized
                        thisController.errorOccurred(ValidationMessages.CONNECTION_ERROR);
                    } else {
                        const oResult = JSON.parse(oJqXhr.responseText);
                        const sReasonMessage = oResult.content.reason;
                        thisController.errorOccurred(sReasonMessage);
                    }
                    sap.ui.getCore().byId(UIComponents.LOGIN_BUTTON).setBusy(false);
                }
            });
        },

        errorOccurred: function(sMessage) {
            const oModelData = {
                message: sMessage
            };
            this.passModel(new LoginObjectModel(oModelData));
        }
    });
});