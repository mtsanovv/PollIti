sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_USERS_LISTING, {
        pageLoaded: function() {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.USERS_ENDPOINT].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(aUsers) {
                    thisController.passModel(new UsersListingObjectModel({
                        users: aUsers
                    }));
                    // after the view fills the table, it sets app.busy to false, so no need to do it here
                },
                error: function()
                {
                    // the only possible error here is a network one so we need to go back to the launchpad
                    thisController.navTo(Globals.NAV_LAUNCHPAD);
                }
            });
        },

        tryDeleteUser: function() {
            const thisController = this;
            const oView = this.getView();
            const oModel = oView.getModel().getProperty(Globals.MODEL_PATH);
            const sUsernameToDelete = oModel.getUsernameToDelete();
            const sEndpoint = [Config.API_BASE_URL, Globals.USERS_ENDPOINT, sUsernameToDelete].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'DELETE',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function() {
                    thisController.setAppBusy(true);
                    oView.loadPage();
                },
                error: function(oJqXhr)
                {
                    if(oJqXhr.readyState != 4 || oJqXhr.status != 400) {
                        // network error or http status different than 400 Bad Request
                        thisController.errorOccurred(ValidationMessages.ERROR_WHILE_DELETING_USER_PREFIX + sUsernameToDelete + "'");
                    } else {
                        const oResult = JSON.parse(oJqXhr.responseText);
                        const sReasonMessage = oResult.content.reason;
                        thisController.errorOccurred(sReasonMessage);
                    }
                }
            });
        },

        navigateToUpdateUser: function(sUsername) {
            this.navTo(Globals.NAV_UPDATE_USER, { username: sUsername });
        },
    });
});