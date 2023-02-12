sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function (Controller) {
    'use strict';

    return Controller.extend(UIComponents.POLLITI_CONTROLLER_MAIN, {
        onInit: function() {
            this.setHTMLPageTitle();
            this.getPollData();
        },

        getPollData: function() {
            const oThisController = this;
            const sToken = this.getPollToken();
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_TOKENS_BACKEND_ENDPOINT, sToken].join(Globals.URI_DELIMITER);
            const oMainPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_MAIN);
            oMainPage.setBusy(true);

            $.ajax({
                type: 'GET',
                url: sEndpoint,
                success: function (oResult) {
                    const oModel = new MainObjectModel(oResult);
                    oModel.setSuccess(true);
                    oThisController.setHTMLPageTitle(oModel.getPollTitle());
                    oThisController.passModel(oModel);
                    oMainPage.setBusy(false);
                },
                error: function (oJqXhr) {
                    if(oJqXhr.readyState != 4 || oJqXhr.status != 404) {
                        // network error or http status different than 404 Not Found
                        oThisController.errorOccurred(ValidationMessages.POLL_UNAVAILABLE);
                    } else {
                        const oResult = JSON.parse(oJqXhr.responseText);
                        const sReasonMessage = oResult.content.reason;
                        oThisController.errorOccurred(sReasonMessage);
                    }
                    oMainPage.setBusy(false);
                }
            });
        },

        getPollToken: function() {
            return new URLSearchParams(window.location.search).get(Globals.TOKEN_QUERY_PARAM);
        },

        onSubmit: function() {
            const oModel = this.getView().getModel().getProperty(Globals.MODEL_PATH);
            const iSelectedIndex = oModel.getSelectedOptionIndex();
            const aPollOptions = oModel.getPollOptions();
            if(iSelectedIndex == aPollOptions.length) {
                this.submitVote(Globals.VOTES_UNDECIDED_ENDPOINT_SUFFIX);
                return;
            }
            this.submitVote(Globals.VOTES_OPTION_ENDPOINT_SUFFIX, aPollOptions[iSelectedIndex]);
        },

        submitVote: function(sEndpointSuffix, sOptionChosen) {
            const oThisController = this;
            const sToken = this.getPollToken();
            const sEndpoint = [Config.API_BASE_URL, Globals.POLLS_TOKENS_BACKEND_ENDPOINT, sToken, sEndpointSuffix].join(Globals.URI_DELIMITER);
            const oMainPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_MAIN);
            const oRequestBody = {};

            if(sOptionChosen !== undefined) {
                oRequestBody[Globals.TITLE_REQUEST_BODY_PARAM] = sOptionChosen;
            }

            oMainPage.setBusy(true);

            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: sEndpoint,
                data: JSON.stringify(oRequestBody),
                success: function () {
                    const oModelData = {
                        message: ValidationMessages.VOTING_SUCCESSFUL,
                        success: true
                    };
                    oThisController.passModel(new MainObjectModel(oModelData));
                    oMainPage.setBusy(false);
                },
                error: function () {
                    oThisController.errorOccurred(ValidationMessages.VOTING_FAILED);
                    oMainPage.setBusy(false);
                }
            });
        },

        errorOccurred: function(sMessage) {
            const oModelData = {
                message: sMessage,
                success: false
            };
            this.passModel(new MainObjectModel(oModelData));
        },

        passModel: function(oObjectModel) {
            const oModel = {
                [Globals.MODEL_PATH_KEY]: oObjectModel
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(oModel));
            this.getView().applyModel();
        },

        setHTMLPageTitle: function(sDescription) {
            const aTitleItems = [Config.AGENCY_NAME, 'Poll'];
            if(sDescription) {
                aTitleItems.push(sDescription);
            }
            document.title = aTitleItems.join(Globals.HTML_PAGE_TITLE_DELIMITER);
        }
    });
});