class Globals {
    static ROLES = {
        Administrator: 'Administrator',
        Agent: 'Agent'
    };

    static URI_DELIMITER = '/';

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
                    pattern: [this.NAV_POLLS, '{pollId}'].join(this.URI_DELIMITER)
                },
                [this.NAV_POLLS_LISTING]: {
                    pattern: this.NAV_POLLS
                },
                [this.NAV_CREATE_POLL]: {
                    pattern: [this.NAV_POLLS, 'create'].join(this.URI_DELIMITER)
                },
                [this.NAV_USER]: {
                    pattern: [this.NAV_USERS, '{username}'].join(this.URI_DELIMITER)
                },
                [this.NAV_USERS_LISTING]: {
                    pattern: this.NAV_USERS
                },
                [this.NAV_CREATE_USER]: {
                    pattern: [this.NAV_USERS, 'create'].join(this.URI_DELIMITER)
                },
                [this.NAV_UPDATE_USER]: {
                    pattern: [this.NAV_USERS, '{username}', 'edit'].join(this.URI_DELIMITER)
                }
            }
        }
    }

    static POLLITI_PAGE_LOGIN_TITLE = 'Login';
    static POLLITI_PAGE_LAUNCHPAD_TITLE = 'Launchpad';
    static POLLITI_PAGE_CREATE_POLL_TITLE = 'Create a Poll';
    static POLLITI_PAGE_POLLS_LISTING_TITLE = 'Polls Listing';
    static POLLITI_PAGE_CREATE_USER_TITLE = 'Create a New Agent';
    static POLLITI_PAGE_USERS_LISTING_TITLE = 'Users Listing';

    static NAV_CONTENT = [
        {
            id: this.NAV_LAUNCHPAD,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_LAUNCHPAD].pattern,
            icon: 'sap-icon://grid',
            text: this.POLLITI_PAGE_LAUNCHPAD_TITLE
        },
        {
            id: this.NAV_CREATE_POLL,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_CREATE_POLL].pattern,
            icon: 'sap-icon://create-form',
            text: this.POLLITI_PAGE_CREATE_POLL_TITLE,
        },
        {
            id: this.NAV_POLLS_LISTING,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_POLLS_LISTING].pattern,
            icon: 'sap-icon://form',
            text: this.POLLITI_PAGE_POLLS_LISTING_TITLE,
        },
        {
            id: this.NAV_CREATE_USER,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_CREATE_USER].pattern,
            icon: 'sap-icon://add-employee',
            text: this.POLLITI_PAGE_CREATE_USER_TITLE,
            requiredRoles: [this.ROLES.Administrator],
        },
        {
            id: this.NAV_USERS_LISTING,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_USERS_LISTING].pattern,
            icon: 'sap-icon://employee-lookup',
            text: this.POLLITI_PAGE_USERS_LISTING_TITLE,
            requiredRoles: [this.ROLES.Administrator],
        },
        // launchpad-only navs go always at the end so that they don't mess up the side nav
        {
            urlEvaluationFunction: function() { return Config.FACEBOOK_URL; }, // since the URL will be set during runtime
            icon: ['sap-icon:', '', UIComponents.POLLITI_SOCIAL_FONT, 'facebook'].join(this.URI_DELIMITER),
            text: Config.AGENCY_NAME + ' Facebook',
            launchpadOnly: true
        },
        {
            urlEvaluationFunction: function() { return Config.INSTAGRAM_URL; }, // since the URL will be set during runtime
            icon: ['sap-icon:', '', UIComponents.POLLITI_SOCIAL_FONT, 'instagram'].join(this.URI_DELIMITER),
            text: Config.AGENCY_NAME + ' Instagram',
            launchpadOnly: true
        }
    ];

    static HTML_PAGE_TITLE_DELIMITER = ' | ';

    static ROUTE_HISTORY_MODEL_PROPERTY = 'routeHistory';
    static ROUTE_HISTORY_MODEL_PATH = this.URI_DELIMITER + this.ROUTE_HISTORY_MODEL_PROPERTY;
    static MODEL_PATH_KEY = 'obj';
    static MODEL_PATH = this.URI_DELIMITER + this.MODEL_PATH_KEY;

    static ME_ENDPOINT = 'me';
    static LOGIN_ENDPOINT = 'login';
    static LOGOUT_ENDPOINT = 'logout';
    static SOCIALS_ENDPOINT = 'socials';
    static USERS_ENDPOINT = 'users';

    static LOGOUT_BUTTON_TOOLTIP = 'Logout';

    static USERNAME_INPUT_PLACEHOLDER = 'Username';
    static PASSWORD_INPUT_PLACEHOLDER = 'Password';

    static ERROR_DIALOG_TITLE = 'An Error has Occurred';
    static DIALOG_DISMISS_BUTTON_TEXT = 'Dismiss';
    static DIALOG_NO_BUTTON_TEXT = 'No';
    static DIALOG_YES_BUTTON_TEXT = 'Yes';

    static ACTION_UNAVAILABLE = 'Action unavailable';

    static LAUNCHPAD_WELCOME_MESSAGE_PREFIX = 'Hello, ';

    static USERNAME_TITLE = 'Username';
    static DISPLAY_NAME_TITLE = 'Display Name';
    static ACTIONS_TITLE = 'Actions';

    static USERS_LISTING_TABLE_HEADER_USERS_COUNT_PREFIX = 'PollIti Users (';
    static USERS_LISTING_USER_DELETION_DIALOG_TITLE_PREFIX = "Deleting user '";

    static UPDATE_USER_BUTTON_TEXT = 'Update User';
    static DELETE_USER_BUTTON_TEXT = 'Delete User';
    static CREATE_USER_BUTTON_TEXT = 'Create User';

    static escapeRegex(sRegex) {
        return sRegex.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
}