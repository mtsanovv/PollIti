sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_POLL_DETAILS, {
        pageLoaded: function(iPollId) {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT, iPollId].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(oPoll) {
                    thisController.fetchPollVotes(oPoll);
                },
                error: function(oJqXhr) {
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

        fetchPollVotes: function(oPoll) {
            const thisController = this;
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT, oPoll.id, Globals.POLLS_VOTES_ENDPOINT_SUFFIX].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function(oPollVotes) {
                    const oCompletePollData = { ...oPoll, ...oPollVotes };
                    thisController.passModel(new PollDetailsObjectModel(oCompletePollData));
                },
                error: function(oJqXhr) {
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

        tryDeletePoll: function() {
            const thisController = this;
            const oView = this.getView();
            const sPollId = this.getPollIdFromCurrentRouteArguments();
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT, sPollId].join(Globals.URI_DELIMITER);

            $.ajax({
                type: 'DELETE',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                success: function() {
                    oView.resetPage();
                    thisController.navTo(Globals.NAV_POLLS_LISTING);
                },
                error: function(oJqXhr) {
                    if(oJqXhr.readyState != 4 || (oJqXhr.status != 400 && oJqXhr.status != 401)) {
                        // network error or http status different than 400 Bad Request and 401 Unauthorized
                        thisController.errorOccurred(ValidationMessages.ERROR_WHILE_DELETING_POLL);
                    } else if(oJqXhr.status == 400) {
                        const sErrorMessage = thisController.createCompositeErrorMessage(oJqXhr.responseText);
                        thisController.errorOccurred(sErrorMessage);
                    } else {
                        oView.resetPage();
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                }
            });
        },

        navToManualPollVotingMode: function() {
            const sPollId = this.getCurrentRouteArguments().pollId;
            this.navTo(Globals.NAV_POLL_VOTING, { pollId: sPollId });
        },

        getPollIdFromCurrentRouteArguments: function() {
            return this.getCurrentRouteArguments().pollId;
        },
    });
});