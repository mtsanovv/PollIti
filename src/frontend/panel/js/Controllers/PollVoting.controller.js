sap.ui.define([
    './BaseController'
], function(BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_POLL_VOTING, {
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
                    thisController.passModel(new PollVotingObjectModel(oPoll));
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

        onSubmit: function() {
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const iSelectedIndex = oModel.getSelectedOptionIndex();
            const aPollOptions = oModel.getPollOptions();
            if(iSelectedIndex == aPollOptions.length) {
                this.submitVote(Globals.POLLS_UNDECIDED_ENDPOINT_SUFFIX);
                return;
            }
            this.submitVote(Globals.POLLS_OPTION_ENDPOINT_SUFFIX, aPollOptions[iSelectedIndex]);
        },

        submitVote: function(sEndpointSuffix, sOptionChosen) {
            const thisController = this;
            const sPollId = this.getPollIdFromCurrentRouteArguments();
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_ENDPOINT, sPollId, Globals.POLLS_VOTES_ENDPOINT_SUFFIX, sEndpointSuffix].join(Globals.URI_DELIMITER);
            const oRequestBody = {};

            if(sOptionChosen !== undefined) {
                oRequestBody['title'] = sOptionChosen;
            }

            $.ajax({
                type: 'POST',
                url: sEndpoint,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(oRequestBody),
                contentType: Globals.POLLITI_BACKEND_REQUEST_CONTENT_TYPE,
                success: function() {
                    thisController.passModel(new PollVotingObjectModel({ success: true }));
                },
                error: function(oJqXhr) {
                    if(oJqXhr.readyState != 4 || (oJqXhr.status != 400 && oJqXhr.status != 404 && oJqXhr.status != 401)) {
                        // network error or http status different than 400, 404, 401
                        thisController.votingErrorOcurred(ValidationMessages.MANUAL_VOTING_VOTE_CAST_FAIL);
                    } else if(oJqXhr.status == 400 || oJqXhr.status == 404) {
                        const sErrorMessage = thisController.createCompositeErrorMessage(oJqXhr.responseText);
                        thisController.votingErrorOcurred(sErrorMessage);
                    } else {
                        thisController.navTo(Globals.NAV_LOGIN);
                    }
                }
            });
        },

        votingErrorOcurred: function(sMessage) {
            // voting errors happen after the initialization so they need to be treated differently
            const oModelData = {
                votingError: sMessage
            };
            this.passModel(new PollVotingObjectModel(oModelData));
        }
    });
});