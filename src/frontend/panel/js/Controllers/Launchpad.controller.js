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
                error: function()
                {
                    thisController.errorOccurred(ValidationMessages.CONNECTION_ERROR);
                    thisController.getApp().setBusy(false);
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
                    thisController.getApp().setBusy(false);
                },
                error: function()
                {
                    thisController.errorOccurred(ValidationMessages.CONNECTION_ERROR);
                    thisController.getApp().setBusy(false);
                }
            });
        },

        setSocialLinksInConfig(oSocialLinks) {
            Config.FACEBOOK_URL = oSocialLinks.facebook;
            Config.INSTAGRAM_URL = oSocialLinks.instagram;
        }
    });
});