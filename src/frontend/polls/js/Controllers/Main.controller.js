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
                    oModel.setSuccess(true);
                    oThisController.setHTMLPageTitle(oModel.getPollTitle());
                    oThisController.passModel(oModel);
                    oMainPage.setBusy(false);
                },
                error: function (oJqXhr)
                {
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

        errorOccurred: function(sMessage) {
            const oModelData = {
                message: sMessage,
                success: false
            };
            this.passModel(new MainObjectModel(oModelData));
        },

        passModel: function(oData) {
            const oModel = {
                [Globals.MODEL_PATH_KEY]: oData
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(oModel));
            this.getView().applyModel();
        },

        setHTMLPageTitle: function(description = 'Poll') {
            document.title = CONFIG.AGENCY_NAME + ' | ' + description;
        }
    });
});