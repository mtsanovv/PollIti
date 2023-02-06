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
                error: function(oJqXhr) {
                    thisController.setAppBusy(false);
                    if(oJqXhr.readyState != 4 || oJqXhr.status != 401) {
                        // network error or http status different than 401 Unauthorized
                        // the UsersListing page cannot handle such an error so the launchpad should do it as it's the main page
                        thisController.navTo(Globals.NAV_LAUNCHPAD);
                    } else {
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
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
                error: function(oJqXhr) {
                    if(oJqXhr.readyState != 4 || (oJqXhr.status != 400 && oJqXhr.status != 401)) {
                        // network error or http status different than 400 Bad Request and 401 Unauthorized
                        thisController.errorOccurred(ValidationMessages.ERROR_WHILE_DELETING_USER_PREFIX + sUsernameToDelete + "'");
                    } else if(oJqXhr.status == 400) {
                        const sErrorMessage = thisController.createCompositeErrorMessage(oJqXhr.responseText);
                        thisController.errorOccurred(sErrorMessage);
                    } else {
                        oView.resetPage(); // so that the dialog closes
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                }
            });
        },

        navigateToUpdateUser: function(sUsername) {
            this.navTo(Globals.NAV_UPDATE_USER, { username: sUsername });
        },
    });
});