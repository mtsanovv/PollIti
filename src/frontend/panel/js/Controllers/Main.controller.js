sap.ui.define([
    './BaseController'
], function (BaseController) {
    'use strict';

    return BaseController.extend(UIComponents.POLLITI_CONTROLLER_MAIN, {
        onInit: function () {
            const thisController = this;
            // create all the views
            this.createViews().then(() => {
                // if there was a specific page requested initially, save it in order to go to it later
                thisController.pushCurrentRouteToRouteHistory();
                // we have saved the initially requested page, now let's clean the request URL
                // getRouter().navTo() is used instead of navTo() because in the onInit method, the view is not defined yet and getFirstChildViewController throws an error
                thisController.getRouter().navTo(Globals.NAV_HOME);
                // watch for route changes
                thisController.getRouter().attachRouteMatched(thisController.onRouteChange.bind(thisController));
                // switch to the login view when all views have been created
                thisController.getRouter().navTo(Globals.NAV_LOGIN);
            });
        },

        pushRouteToRouteHistory: function(oNewRoute) {
            // only the Main controller knows about the owner component
            const oComponentModel = this.getOwnerComponent().getModel();
            if(oComponentModel) {
                const aRouteHistory = oComponentModel.getProperty(Globals.ROUTE_HISTORY_MODEL_PATH);
                aRouteHistory.push(oNewRoute);
                return;
            }
            this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({
                    [Globals.ROUTE_HISTORY_MODEL_PROPERTY]: [oNewRoute]
                })
            );
        },

        pushCurrentRouteToRouteHistory: function() {
            const oNewRoute = {
                route: this.getCurrentRouteName(),
                arguments: this.getCurrentRouteArguments()
            };
            this.pushRouteToRouteHistory(oNewRoute);
        },

        createViews: async function() {
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_LOGIN, viewName: UIComponents.POLLITI_VIEW_LOGIN})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_LAUNCHPAD, viewName: UIComponents.POLLITI_VIEW_LAUNCHPAD})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_USERS_LISTING, viewName: UIComponents.POLLITI_VIEW_USERS_LISTING})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_POLLS_LISTING, viewName: UIComponents.POLLITI_VIEW_POLLS_LISTING})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_USER_EDITOR, viewName: UIComponents.POLLITI_VIEW_USER_EDITOR})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_POLL_CREATION, viewName: UIComponents.POLLITI_VIEW_POLL_CREATION})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_POLL_DETAILS, viewName: UIComponents.POLLITI_VIEW_POLL_DETAILS})));
            this.getApp().addPage((await sap.ui.core.mvc.JSView.create({id: UIComponents.POLLITI_VIEW_POLL_VOTING, viewName: UIComponents.POLLITI_VIEW_POLL_VOTING})));
        },

        awaitCurrentPageActivation: async function(sPageId) {
            const oApp = this.getApp();
            while(oApp.getCurrentPage().getId() != sPageId) {
                // block the UI thread until the current page is loaded (usually this is a race condition when switching too fast between pages)
                await new Promise(fResolve => setTimeout(fResolve, 100));
            }
        },

        onRouteChange: async function (oEvent) {
            const sRouteName = oEvent.getParameter('name');
            const oArgs = oEvent.getParameter('arguments');
            const oApp = this.getApp();

            switch(sRouteName) {
                case Globals.NAV_LOGIN:
                    this.showMainPageNav(false);
                    this.showLogoutButton(false);
                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_LOGIN);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_LOGIN);
                    oApp.getCurrentPage().loadPage();
                    this.changeHTMLPageTitle(Globals.POLLITI_PAGE_LOGIN_TITLE);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_LAUNCHPAD:
                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_LAUNCHPAD);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_LAUNCHPAD);
                    oApp.getCurrentPage().loadPage();
                    this.changeHTMLPageTitle(Globals.POLLITI_PAGE_LAUNCHPAD_TITLE);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_USERS_LISTING:
                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_USERS_LISTING);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_USERS_LISTING);
                    oApp.getCurrentPage().loadPage();
                    this.changeHTMLPageTitle(Globals.POLLITI_PAGE_USERS_LISTING_TITLE);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_POLLS_LISTING:
                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_POLLS_LISTING);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_POLLS_LISTING);
                    oApp.getCurrentPage().loadPage();
                    this.changeHTMLPageTitle(Globals.POLLITI_PAGE_POLLS_LISTING_TITLE);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_CREATE_USER:
                    const sPageTitle = Globals.POLLITI_PAGE_CREATE_USER_TITLE;
                    const oNestedPage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_USER_EDITOR);

                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_USER_EDITOR);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_USER_EDITOR);
                    oApp.getCurrentPage().loadPage();
                    oNestedPage.setTitle(sPageTitle);
                    this.changeHTMLPageTitle(sPageTitle);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_UPDATE_USER:
                    const sUsername = oArgs.username;
                    const sUpdatePageTitle = Globals.POLLITI_PAGE_UPDATE_USER_TITLE_PREFIX + "'" + sUsername + "'";
                    const oNestedUpdatePage = sap.ui.getCore().byId(UIComponents.POLLITI_PAGE_USER_EDITOR);

                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_USER_EDITOR);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_USER_EDITOR);
                    oApp.getCurrentPage().loadPage(sUsername);
                    oNestedUpdatePage.setTitle(sUpdatePageTitle);
                    this.changeHTMLPageTitle(sUpdatePageTitle);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_CREATE_POLL:
                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_POLL_CREATION);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_POLL_CREATION);
                    oApp.getCurrentPage().loadPage();
                    this.changeHTMLPageTitle(Globals.POLLITI_PAGE_CREATE_POLL_TITLE);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
                case Globals.NAV_POLL:
                    const sPollId = oArgs.pollId;
                    const sPollDetailsPageTitle = Globals.POLLITI_PAGE_POLL_DETAILS_TITLE_PREFIX + sPollId;

                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_POLL_DETAILS);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_POLL_DETAILS);
                    oApp.getCurrentPage().loadPage(sPollId);
                    this.changeHTMLPageTitle(sPollDetailsPageTitle);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;

                case Globals.NAV_POLL_VOTING:
                    const sVotingPollId = oArgs.pollId;
                    const sPollVotingPageTitle = Globals.POLLITI_PAGE_POLL_DETAILS_TITLE_PREFIX + sVotingPollId + ' Voting';

                    this.setAppBusy(true);
                    oApp.to(UIComponents.POLLITI_VIEW_POLL_VOTING);
                    await this.awaitCurrentPageActivation(UIComponents.POLLITI_VIEW_POLL_VOTING);
                    oApp.getCurrentPage().loadPage(sVotingPollId);
                    this.changeHTMLPageTitle(sPollVotingPageTitle);
                    this.changeSelectedNavKey(sRouteName);
                    this.pushCurrentRouteToRouteHistory();
                    break;
            }
        },

        attemptLogout: function() {
            const thisController = this;
            const oLogoutButton = sap.ui.getCore().byId(UIComponents.LOGOUT_BUTTON);
            oLogoutButton.setBusy(true);

            this.ajaxLogout(oLogoutButton);
        },

        changeSelectedNavKey: function(sKey) {
            sap.ui.getCore().byId(UIComponents.SIDE_NAV).setSelectedKey(sKey);
        }
    });
});