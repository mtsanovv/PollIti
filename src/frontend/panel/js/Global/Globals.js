class Globals {
    static NAV_HOME = 'home';
    static NAV_LOGIN = 'login';
    static NAV_LAUNCHPAD = 'launchpad';
    static NAV_POLLS = 'polls';
    static NAV_POLL = 'poll';
    static NAV_POLLS_LISTING = 'pollsListing';
    static NAV_CREATE_POLL = 'createPoll';
    static NAV_USERS = 'users';
    static NAV_USER = 'user';
    static NAV_USERS_LISTING = 'usersListing';
    static NAV_CREATE_USER = 'createUser';
    static NAV_UPDATE_USER = 'updateUser';

    static POLLITI_COMPONENT_METADATA = {
        rootView: {
            viewName: UIComponents.POLLITI_VIEW_MAIN,
            type: 'JS',
            async: true,
            id: UIComponents.POLLITI_VIEW_MAIN
        },
        routing: {
            routes: {
                [this.NAV_HOME]: {
                    pattern: ""
                },
                [this.NAV_LOGIN]: {
                    pattern: this.NAV_LOGIN
                },
                [this.NAV_LAUNCHPAD]: {
                    pattern: this.NAV_LAUNCHPAD
                },
                [this.NAV_POLL]: {
                    pattern: this.NAV_POLLS + "/{pollId}"
                },
                [this.NAV_POLLS_LISTING]: {
                    pattern: this.NAV_POLLS
                },
                [this.NAV_CREATE_POLL]: {
                    pattern: this.NAV_POLLS + '/create'
                },
                [this.NAV_USER]: {
                    pattern: this.NAV_USERS + "/{userId}"
                },
                [this.NAV_USERS_LISTING]: {
                    pattern: this.NAV_USERS
                },
                [this.NAV_CREATE_USER]: {
                    pattern: this.NAV_USERS + 'create'
                },
                [this.NAV_UPDATE_USER]: {
                    pattern: this.NAV_USERS + "/{userId}/edit"
                }
            }
        }
    }

    static THEMES = [
        {
            name: 'Fiori Light',
            id: 'sap_fiori_3'
        },
        {
            name: 'Fiori Dark',
            id: 'sap_fiori_3_dark'
        },
        {
            name: 'Fiori High Contrast Black',
            id: 'sap_fiori_3_hcb'
        },
        {
            name: 'Fiori High Contrast White',
            id: 'sap_fiori_3_hcw'
        },
        {
            name: 'Belize',
            id: 'sap_belize'
        },
        {
            name: 'Belize Plus',
            id: 'sap_belize_plus'
        },
        {
            name: 'Belize High Contrast Black',
            id: 'sap_belize_hcb'
        },
        {
            name: 'Belize High Contrast White',
            id: 'sap_belize_hcw'
        }
    ];

    static POLLITI_PAGE_LOGIN_TITLE = 'Login';
    static POLLITI_PAGE_LAUNCHPAD_TITLE = 'Launchpad';
    static POLLITI_PAGE_CREATE_POLL_TITLE = 'Create Poll';
    static POLLITI_PAGE_POLLS_LISTING_TITLE = 'Polls Listing';
    static POLLITI_PAGE_CREATE_USER_TITLE = 'Create User';
    static POLLITI_PAGE_USERS_LISTING_TITLE = 'Users Listing';

    static SIDE_NAV_CONTENT = [
        {
            id: this.NAV_LAUNCHPAD,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_LAUNCHPAD].pattern,
            icon: 'sap-icon://grid',
            text: this.POLLITI_PAGE_LAUNCHPAD_TITLE
        },
        {
            id: this.NAV_CREATE_POLL,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_CREATE_POLL].pattern,
            icon: 'sap-icon://add-activity',
            text: this.POLLITI_PAGE_CREATE_POLL_TITLE
        },
        {
            id: this.NAV_POLLS_LISTING,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_POLLS_LISTING].pattern,
            icon: 'sap-icon://activity-items',
            text: this.POLLITI_PAGE_POLLS_LISTING_TITLE
        },
        {
            id: this.NAV_CREATE_USER,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_CREATE_USER].pattern,
            icon: 'sap-icon://add-employee',
            text: this.POLLITI_PAGE_CREATE_USER_TITLE
        },
        {
            id: this.NAV_USERS_LISTING,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_USERS_LISTING].pattern,
            icon: 'sap-icon://account',
            text: this.POLLITI_PAGE_USERS_LISTING_TITLE
        }
    ];

    static DEFAULT_THEME = this.THEMES[0].id;
    static SAVED_THEME_STORAGE_PREFIX = 'pollItiPanelPersistentStorage';

    static URI_DELIMITER = '/';
    static HTML_PAGE_TITLE_DELIMITER = ' | ';

    static ROUTE_HISTORY_MODEL_PROPERTY = 'routeHistory';
    static ROUTE_HISTORY_MODEL_PATH = this.URI_DELIMITER + this.ROUTE_HISTORY_MODEL_PROPERTY;
    static MODEL_PATH_KEY = 'obj';
    static MODEL_PATH = this.URI_DELIMITER + this.MODEL_PATH_KEY;

    static CHANGE_THEME_DIALOG_TITLE = 'Pick a theme';
    static CHANGE_THEME_DIALOG_BUTTON_TEXT = 'Close';
    static CHANGE_THEME_BUTTON_TOOLTIP = 'Change theme';
}