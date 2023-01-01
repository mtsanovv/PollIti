sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend(UIComponents.POLLITI_COMPONENT, {
        metadata: Globals.POLLITI_COMPONENT_METADATA,
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});