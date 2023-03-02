sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_POLL_TRENDS, {
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
                    if(aPolls.length < ValidationConstants.POLL_TRENDS_MIN_POLLS) {
                        thisController.errorOccurred(ValidationMessages.NOT_ENOUGH_POLLS_FOR_TRENDS);
                        return;
                    }
                    thisController.passModel(new PollTrendsObjectModel({
                        polls: aPolls
                    }));
                },
                error: function(oJqXhr) {
                    thisController.setAppBusy(false);
                    if(oJqXhr.readyState != 4 || (oJqXhr.status != 404 && oJqXhr.status != 401)) {
                        // network error or http status different than 404 and 401
                        thisController.errorOccurred(ValidationMessages.UNEXPECTED_SERVER_RESPONSE);
                    } else if(oJqXhr.status == 404) {
                        const sErrorMessage = thisController.createCompositeErrorMessage(oJqXhr.responseText);
                        thisController.errorOccurred(sErrorMessage);
                    } else {
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                }
            });
        }
    });
});