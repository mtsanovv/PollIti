sap.ui.jsview(UIComponents.POLLITI_VIEW_LAUNCHPAD, {
    getControllerName: function() {
        return UIComponents.POLLITI_CONTROLLER_LAUNCHPAD;
    },

    createContent: function(oController) {
        const oPage = new sap.m.Page(UIComponents.POLLITI_PAGE_LAUNCHPAD, { title: Globals.POLLITI_PAGE_LAUNCHPAD_TITLE });
        const oVerticalLayout = new sap.ui.layout.VerticalLayout();
        oVerticalLayout.addStyleClass('sapUiResponsiveMargin');

        this.fillPageLayout(oVerticalLayout);
        this.createErrorDialog(oPage);

        oPage.addContent(oVerticalLayout);
        return oPage;
    },

    createErrorDialog: function(oPage) {
        const oErrorDialog = new sap.m.Dialog(UIComponents.LAUNCHPAD_ERROR_DIALOG, {
            title: Globals.ERROR_DIALOG_TITLE,
            titleAlignment: sap.m.TitleAlignment.Center,
            type: sap.m.DialogType.Message
        });
        const oErrorDialogMessageStrip = new sap.m.MessageStrip(UIComponents.LAUNCHPAD_ERROR_DIALOG_MESSAGE_STRIP, { type: sap.ui.core.MessageType.Error, showIcon: true });
        oErrorDialogMessageStrip.addStyleClass('sapUiResponsiveMargin');

        oErrorDialog.addContent(oErrorDialogMessageStrip);
        oPage.addContent(oErrorDialog);
    },

    fillPageLayout: function(oVerticalLayout) {
        this.createWelcomeTitle(oVerticalLayout);
        this.createTiles(oVerticalLayout);
    },

    createWelcomeTitle(oVerticalLayout) {
        const oWelcomeTitle = new sap.m.Title(UIComponents.LAUNCHPAD_WELCOME_TITLE, { titleStyle: sap.ui.core.TitleLevel.H2 });
        oWelcomeTitle.addStyleClass('sapUiSmallMarginBeginEnd')
                     .addStyleClass('sapUiMediumMarginTopBottom')
                     .setVisible(false);
        oVerticalLayout.addContent(oWelcomeTitle);
    },

    createTiles(oVerticalLayout) {
        const oHorizontalLayout = new sap.ui.layout.HorizontalLayout(UIComponents.LAUNCHPAD_TILES_CONTAINER, { allowWrapping: true });
        oHorizontalLayout.addStyleClass('sapUiTinyMarginBegin');
        for(const oTileModel of Globals.NAV_CONTENT) {
            if(oTileModel.id == Globals.NAV_LAUNCHPAD) {
                continue;
            }
            this.createTile(oHorizontalLayout, oTileModel);
        }
        oVerticalLayout.addContent(oHorizontalLayout);
    },

    createTile: function(oTileContainer, oTileModel) {
        const thisView = this;
        const oTile = new sap.m.GenericTile({ header: oTileModel.text, failedText: Globals.ACTION_UNAVAILABLE });
        oTile.addStyleClass('sapUiTinyMarginBegin')
             .addStyleClass('sapUiTinyMarginBottom')
             .setVisible(false)
             .attachPress(() => {
                thisView.tileNavTo(oTileModel);
             });
        const oTileContent = new sap.m.TileContent();
        const oTileImageContent = new sap.m.ImageContent({ src: oTileModel.icon });

        oTileContent.setContent(oTileImageContent);
        oTile.addTileContent(oTileContent);
        oTileContainer.addContent(oTile);
    },

    tileNavTo(oTileModel) {
        const oController = this.getController();
        const fEvaluateUrl = oTileModel.urlEvaluationFunction;
        if(fEvaluateUrl) {
            window.open(fEvaluateUrl.call(), '_blank');
            return;
        }
        oController.navTo(oTileModel.id);
    },

    applyModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        this.applyBasicObjectModel();
        if(!oModel.isBaseObjectModel()) {
            this.applyViewSpecificObjectModel();
        }
    },

    applyBasicObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sMessage = oModel.getMessage();
        const oErrorDialog = sap.ui.getCore().byId(UIComponents.LAUNCHPAD_ERROR_DIALOG);
        const oErrorDialogMessageStrip = sap.ui.getCore().byId(UIComponents.LAUNCHPAD_ERROR_DIALOG_MESSAGE_STRIP);

        if(sMessage) {
            oErrorDialogMessageStrip.setText(sMessage);
            oErrorDialog.open();
        }
    },

    applyViewSpecificObjectModel: function() {
        const oModel = this.getModel().getProperty(Globals.MODEL_PATH);
        const sDisplayName = oModel.getDisplayName();
        const sRole = oModel.getRole();
        const oWelcomeTitle = sap.ui.getCore().byId(UIComponents.LAUNCHPAD_WELCOME_TITLE);
        const aTiles = sap.ui.getCore().byId(UIComponents.LAUNCHPAD_TILES_CONTAINER).getContent();

        if(sDisplayName) {
            oWelcomeTitle.setText(Globals.LAUNCHPAD_WELCOME_MESSAGE_PREFIX + sDisplayName + '!');
            oWelcomeTitle.setVisible(true);
        }

        if(sRole) {
            this.filterTilesByRole(aTiles, sRole);
        }
    },

    resetControlsOnPage: function() {
        const oWelcomeTitle = sap.ui.getCore().byId(UIComponents.LAUNCHPAD_WELCOME_TITLE);
        const aTiles = sap.ui.getCore().byId(UIComponents.LAUNCHPAD_TILES_CONTAINER).getContent();

        oWelcomeTitle.setVisible(false);

        for(const oTile of aTiles) {
            oTile.setVisible(false);
        }
    },

    filterTilesByRole: function(aTiles, sRole) {
        let i = 0;
        for(const oTileModel of Globals.NAV_CONTENT) {
            if(oTileModel.id == Globals.NAV_LAUNCHPAD) {
                continue;
            }
            if(oTileModel.requiredRoles && !oTileModel.requiredRoles.includes(sRole)) {
                aTiles[i++].setVisible(false);
                continue;
            }
            aTiles[i++].setVisible(true);
        }
    },

    loadPage: function() {
        this.resetControlsOnPage();
        this.getController().pageLoaded();
    }
});