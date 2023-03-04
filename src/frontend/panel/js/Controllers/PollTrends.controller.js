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
        },

        fetchSelectedPollsDetails: async function() {
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const aPollsToRequestDetailsFor = oModel.getPollsParticipatingInTrend().filter((oElement) => oElement != null).map((oPoll) => oPoll.pollId); // lovin' the perlish touch
            const aPolls = [];

            for(const iPollId of aPollsToRequestDetailsFor) {
                const sPollDetailsEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT, iPollId].join(Globals.URI_DELIMITER);
                const sPollVotesEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT, iPollId, Globals.POLLS_VOTES_ENDPOINT_SUFFIX].join(Globals.URI_DELIMITER);
                const aEndpoints = [sPollDetailsEndpoint, sPollVotesEndpoint];
                let oPollProperties = {};

                for(const sEndpoint of aEndpoints) {
                    try {
                        oPollProperties = { ...oPollProperties, ...await this.requestPollData(sEndpoint) };
                    } catch(oJqXhr) {
                        this.handleFailedPollRequest(oJqXhr);
                        return;
                    }
                }

                aPolls.push(new PollObjectModel(oPollProperties));
            }

            oModel.createChartDatasetsAndLabels(aPolls);
        },

        requestPollData: async function(sEndpoint) {
            return $.ajax({
                type: 'GET',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                }
            });
        },

        handleFailedPollRequest: function(oJqXhr) {
            if(oJqXhr.readyState != 4 || oJqXhr.status != 401) {
                // network error or http status different than 401
                // maybe 404 deserves better error handling but it is handled here as well for now
                this.errorOccurred(ValidationMessages.UNEXPECTED_SERVER_RESPONSE);
            } else {
                this.navTo(Globals.NAV_LOGIN);
            }
        }
    });
});