sap.ui.jsview(UIComponents.POLLITI_VIEW_LAUNCHPAD, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_LAUNCHPAD;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_LAUNCHPAD, { title: Globals.POLLITI_PAGE_LAUNCHPAD_TITLE });
        return oPage;
    },

    loadPage: function() {
        this.getController().pageLoaded();
    }
});