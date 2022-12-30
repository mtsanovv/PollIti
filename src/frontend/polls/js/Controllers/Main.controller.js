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
            const oMainPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_MAIN);
            oMainPage.setBusy(true);
            $.ajax({
                type: 'GET',
                url: CONFIG.API_BASE_URL + Globals.POLLS_TOKENS_BACKEND_ENDPOINT + '/' + sToken,
                success: function (oResult) {
                    const oModel = new MainObjectModel(oResult);
                    oThisController.setHTMLPageTitle(oModel.getPollTitle());
                    oThisController.passModel(oModel);
                    oMainPage.setBusy(false);
                },
                error: function (oJQXhr)
                {
                    if(oJQXhr.readyState != 4 || oJQXhr.status != 404) {
                        // network error or http status different than 404 Not Found
                        oThisController.errorOccurred(ValidationMessages.POLL_UNAVAILABLE);
                    } else {
                        const oResult = JSON.parse(oJQXhr.responseText);
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

        errorOccurred: function(message) {
            const modelData = {
                message: message
            };
            this.passModel(new MainObjectModel(modelData));
        },

        passModel: function(object) {
            const model = {
                obj: object
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(model));
            this.getView().applyModel();
        },

        setHTMLPageTitle: function(description = 'Poll') {
            document.title = CONFIG.AGENCY_NAME + ' | ' + description;
        }
    });
});