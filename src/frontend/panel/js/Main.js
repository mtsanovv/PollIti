sap.ui.define([
    'sap/ui/core/ComponentContainer',
    'sap/ui/core/IconPool'
], function (ComponentContainer, IconPool) {
    'use strict';
    IconPool.registerFont({
        fontFamily: UIComponents.POLLITI_SOCIAL_FONT,
        fontURI: './img/openui5-icons'
    });
    const oContainer = new ComponentContainer({
        name: UIComponents.POLLITI_COMPONENT,
        async: true
    });
    oContainer.placeAt('content');
});