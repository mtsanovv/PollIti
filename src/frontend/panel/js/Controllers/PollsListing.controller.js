sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_POLLS_LISTING, {
        pageLoaded: function() {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(aPolls) {
                    thisController.passModel(new PollsListingObjectModel({
                        polls: aPolls
                    }));
                    // after the view fills the table, it sets app.busy to false, so no need to do it here
                },
                error: function(oJqXhr)
                {
                    thisController.setAppBusy(false);
                    if(oJqXhr.readyState != 4 || (oJqXhr.status != 404 && oJqXhr.status != 401)) {
                        // network error or http status different than 404 and 401
                        thisController.errorOccurred(ValidationMessages.UNEXPECTED_SERVER_RESPONSE);
                    } else if(oJqXhr.status == 404) {
                        thisController.passModel(new PollsListingObjectModel({ polls: [] }));
                    } else {
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                }
            });
        },

        navigateToPollDetails: function(iPollId) {
            this.navTo(Globals.NAV_POLL, { pollId: iPollId });
        },
    });
});