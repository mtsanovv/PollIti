sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_LAUNCHPAD, {
        pageLoaded: function() {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.ME_ENDPOINT].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(oLoggedInUser) {
                    thisController.getSocialUrls(oLoggedInUser);
                },
                error: function(oJqXhr)
                {
                    thisController.setAppBusy(false);
                    if(oJqXhr.readyState != 4 || oJqXhr.status != 401) {
                        // network error or http status different than 401 Unauthorized
                        thisController.errorOccurred(ValidationMessages.CONNECTION_ERROR);
                    } else {
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                }
            });
        },

        getSocialUrls: function(oLoggedInUser) {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.SOCIALS_ENDPOINT].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(oSocialLinks) {
                    thisController.setSocialLinksInConfig(oSocialLinks);
                    thisController.passModel(new LaunchpadObjectModel(oLoggedInUser));
                    thisController.setAppBusy(false);
                },
                error: function()
                {
                    thisController.errorOccurred(ValidationMessages.CONNECTION_ERROR);
                    thisController.setAppBusy(false);
                }
            });
        },

        setSocialLinksInConfig(oSocialLinks) {
            Config.FACEBOOK_URL = oSocialLinks.facebook;
            Config.INSTAGRAM_URL = oSocialLinks.instagram;
        }
    });
});