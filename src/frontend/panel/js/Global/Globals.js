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
    static NAV_POLL_TRENDS = 'pollTrends';
    static NAV_POLL_LOGS = 'pollLogs';
    static NAV_CREATE_POLL = 'createPoll';
    static NAV_POLL_VOTING = 'pollVoting';
    static NAV_USERS = 'users';
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
                [this.NAV_POLLS_LISTING]: {
                    pattern: this.NAV_POLLS
                },
                [this.NAV_POLL_TRENDS]: {
                    pattern: [this.NAV_POLLS, 'trends'].join(this.URI_DELIMITER)
                },
                [this.NAV_POLL_LOGS]: {
                    pattern: [this.NAV_POLLS, 'logs'].join(this.URI_DELIMITER)
                },
                [this.NAV_CREATE_POLL]: {
                    pattern: [this.NAV_POLLS, 'create'].join(this.URI_DELIMITER)
                },
                [this.NAV_POLL]: {
                    pattern: [this.NAV_POLLS, '{pollId}'].join(this.URI_DELIMITER)
                },
                [this.NAV_POLL_VOTING]: {
                    pattern: [this.NAV_POLLS, '{pollId}', 'vote'].join(this.URI_DELIMITER)
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
    static POLLITI_PAGE_USERS_LISTING_TITLE = 'Agents Listing';
    static POLLITI_PAGE_POLLS_LISTING_TITLE = 'Polls Listing';
    static POLLITI_PAGE_UPDATE_USER_TITLE_PREFIX = 'Edit Agent ';
    static POLLITI_PAGE_POLL_DETAILS_TITLE_PREFIX = 'Poll #';
    static POLLITI_PAGE_POLL_DETAILS_NESTED_PAGE_TITLE = 'Poll';
    static POLLITI_PAGE_POLL_LOGS_TITLE = 'Poll Logs';
    static POLLITI_PAGE_POLL_TRENDS_TITLE = 'Poll Trends';

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
            id: this.NAV_POLL_TRENDS,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_POLL_TRENDS].pattern,
            icon: 'sap-icon://area-chart',
            text: this.POLLITI_PAGE_POLL_TRENDS_TITLE,
        },
        {
            id: this.NAV_POLL_LOGS,
            route: this.POLLITI_COMPONENT_METADATA.routing.routes[this.NAV_POLL_LOGS].pattern,
            icon: 'sap-icon://past',
            text: this.POLLITI_PAGE_POLL_LOGS_TITLE,
            requiredRoles: [this.ROLES.Administrator],
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
    static POLLS_ENDPOINT = 'polls';
    static POLLS_VOTES_ENDPOINT_SUFFIX = 'votes';
    static POLLS_SHARING_FACEBOOK_ENDPOINT_SUFFIX = ['sharing', 'facebook'].join(this.URI_DELIMITER);
    static POLLS_SHARING_FACEBOOK_AND_INSTAGRAM_ENDPOINT_SUFFIX = ['sharing', 'facebookAndInstagram'].join(this.URI_DELIMITER);
    static POLLS_TOKENS_ENDPOINT_SUFFIX = 'tokens';
    static POLLS_UNDECIDED_ENDPOINT_SUFFIX = 'undecided';
    static POLLS_OPTION_ENDPOINT_SUFFIX = 'option';
    static POLLS_LOGS_ENDPOINT_SUFFIX = 'logs';

    static LOGOUT_BUTTON_TOOLTIP = 'Logout';

    static INPUT_WIDTH = '295px';
    static POLL_SELECT_INPUT_WIDTH = '200px';
    static USERNAME_INPUT_PLACEHOLDER = 'Username';
    static DISPLAY_NAME_INPUT_PLACEHOLDER = 'Display name';
    static PASSWORD_INPUT_PLACEHOLDER = 'Password';
    static UPDATE_AGENT_PASSWORD_INPUT_PLACEHOLDER = 'New password (optional)';
    static PASSWORD_CONFIRMATION_INPUT_PLACEHOLDER = 'Re-type the password';
    static UPDATE_AGENT_PASSWORD_CONFIRMATION_INPUT_PLACEHOLDER = this.PASSWORD_CONFIRMATION_INPUT_PLACEHOLDER + ' (if applicable)';
    static POLL_TITLE_INPUT_PLACEHOLDER = 'Poll title';
    static THRESHOLD_INPUT_PLACEHOLDER = 'Threshold percentage (optional)';
    static POLL_OPTION_INPUT_PREFIX_PLACEHOLDER = 'Poll option ';
    static EMAIL_ADDRESS_PLACEHOLDER = 'Email address';

    static SUCCESS_DIALOG_TITLE = 'Success';
    static ERROR_DIALOG_TITLE = 'An Error has Occurred';
    static DIALOG_DISMISS_BUTTON_TEXT = 'Dismiss';
    static DIALOG_CONTINUE_TO_LAUNCHPAD_BUTTON_TEXT = 'Continue to Launchpad';
    static DIALOG_NO_BUTTON_TEXT = 'No';
    static DIALOG_YES_BUTTON_TEXT = 'Yes';
    static DIALOG_RETURN_TO_USERS_LISTING_BUTTON_TEXT = 'Return to ' + this.POLLITI_PAGE_USERS_LISTING_TITLE;
    static SUBMIT_BUTTON_TEXT = 'Submit';
    static ADD_OPTION_BUTTON_TEXT = 'Add option';
    static REMOVE_OPTION_BUTTON_TEXT = 'Remove option above';
    static DIALOG_RETURN_TO_POLLS_LISTING_BUTTON_TEXT = 'Return to ' + this.POLLITI_PAGE_POLLS_LISTING_TITLE;
    static DIALOG_CONTINUE_BUTTON_TEXT = 'Continue';

    static ACTION_UNAVAILABLE = 'Action unavailable';

    static LAUNCHPAD_WELCOME_MESSAGE_PREFIX = 'Hello, ';

    static USERNAME_TITLE = 'Username';
    static DISPLAY_NAME_TITLE = 'Display Name';
    static ACTIONS_TITLE = 'Actions';
    static POLL_ID_TITLE = 'Poll ID';
    static POLL_TITLE_TITLE = 'Title';
    static POLL_CREATION_DATE_TITLE = 'Creation Date'
    static ENABLED_TITLE = 'Agent account enabled';
    static TIMESTAMP_TITLE = 'Timestamp (UTC)';
    static MESSAGE_TITLE = 'Message';

    static USERS_LISTING_TABLE_HEADER_USERS_COUNT_PREFIX = 'PollIti Agents (';
    static USERS_LISTING_USER_DELETION_DIALOG_TITLE_PREFIX = "Deleting agent '";

    static UPDATE_USER_BUTTON_TEXT = 'Update Agent';
    static DELETE_USER_BUTTON_TEXT = 'Delete Agent';
    static ADD_BUTTON_TEXT = 'Add';

    static POLLS_LISTING_TABLE_HEADER_POLLS_COUNT_PREFIX = 'Polls (';
    static POLL_LOGS_TABLE_HEADER_LOGS_COUNT_PREFIX = 'Logs (';

    static USER_EDITOR_FORM_TITLE = 'Agent Account Details';
    static POLL_CREATION_FORM_TITLE = 'Poll Details';

    static COMPOSITE_ERROR_MESSAGE_DELIMITER = "\n• ";

    static POLLITI_BACKEND_REQUEST_CONTENT_TYPE = 'application/json';

    static POLL_DETAILS_FILTER_KEY = 'pollDetails';
    static POLL_ACTIONS_FILTER_KEY = 'pollActions';

    static POLL_UNDECIDED_OPTION = 'Undecided';

    static POLL_CHART_DATASET_LABEL = 'Votes';
    static POLL_CHART_TOTAL_VOTES_PREFIX = 'Total votes: ';
    static POLL_CHART_THRESHOLD_PREFIX = 'Threshold: ';

    static DELETE_POLL_BUTTON_TEXT = 'Delete This Poll';
    static ENTER_MANUAL_VOTING_MODE_BUTTON_TEXT = 'Enter Manual Poll Voting Mode';

    static POLL_DELETION_DIALOG_TITLE = 'Deleting This Poll';
    static POLL_DELETION_WARNING = "Are you sure that you want to delete this poll?\n\nThis action cannot be undone.";

    static POLL_MANUAL_VOTING_DIALOG_TITLE = 'Entering Manual Poll Voting Mode';
    static POLL_MANUAL_VOTING_WARNING = "You are entering manual poll voting mode. For security reasons, the only available controls will be the logout button, a list of choices and a 'Submit' button. Once the vote is cast, you will be logged out and you will have to log in again.\n\nWould you like to continue?";

    static SHARE_TO_FACEBOOK_BUTTON_TEXT = 'Share poll results to Facebook only';
    static SHARE_TO_FACEBOOK_AND_INSTAGRAM_BUTTON_TEXT = 'Share poll results to Facebook and Instagram';
    static SHARE_VIA_EMAIL_BUTTON_TEXT = 'Send poll invitation';

    static SEARCH_REGEX_PLACEHOLDER = 'Regex search';

    static POLL_TRENDS_LAYOUT_TITLE = 'Polls for Trend Analysis';
    static POLL_TRENDS_LAYOUT_CHART_ROW_TITLE = 'Trends Chart';
    static POLL_TRENDS_POLL_INPUT_PLACEHOLDER = 'Choose a poll';
    static POLL_TRENDS_CHART_GENERATION_BUTTON_TEXT = 'Generate Trends Chart';
    static POLL_TRENDS_CHART_DATASET_BACKGROUND_COLOR_OPACITY = 50;
    static ADD_POLL_INPUT_TEXT = 'Add poll input';
    static REMOVE_POLL_INPUT_TEXT = 'Remove poll input';

    static INPUT_VALUE_PROPERTY = 'value';

    static EVENT_AFTER_RENDERING = 'afterRendering';

    static escapeRegex(sRegex) {
        return sRegex.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    static getOptionPercentage(iOptionVotes, iPollTotalVotes) {
        let fPercentage = (iOptionVotes * 100 / iPollTotalVotes).toFixed(1);
        if(isNaN(fPercentage)) {
            fPercentage = 0;
        }
        return fPercentage;
    }

    static getPollResultsChartDefinition(aLabels, aValues, aBarColors, iTotalVotes, iThreshold) {
        return {
            type: 'bar',
            plugins: [ChartDataLabels],
            data: {
              labels: aLabels,
              datasets: [{
                label: Globals.POLL_CHART_DATASET_LABEL,
                data: aValues,
                borderWidth: 1,
                backgroundColor: aBarColors
              }]
            },
            options: {
                aspectRatio: 0.6,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            display: true,
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    },
                    y: {
                        display: false
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: Globals.POLL_CHART_TOTAL_VOTES_PREFIX + iTotalVotes,
                        color: 'white',
                        font: {
                            weight: 'normal',
                            size: '18em'
                        },
                        padding: {
                            top: 20,
                            bottom: 10
                        }
                    },
                    subtitle: {
                        display: true,
                        text: Globals.POLL_CHART_THRESHOLD_PREFIX + iThreshold + '%',
                        color: '#91c8f6',
                        font: {
                            weight: 'normal',
                            size: '15em'
                        },
                        padding: {
                            bottom: 30
                        }
                    },
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: 'white',
                        anchor: 'end',
                        align: 'end',
                        offset: -5,
                        labels: {
                            title: {
                                font: {
                                    weight: 'bold'
                                }
                            }
                        },
                        formatter: (iValue, oCtx) => {
                            let iSum = 0;
                            const aData = oCtx.chart.data.datasets[0].data;
                            aData.map(iData => iSum += iData);
                            const sPercentage = this.getOptionPercentage(iValue, iSum) + '%';
                            return sPercentage;
                        },
                    }
                }
            }
        };
    }

    static getPollTrendsChartDefinition(aLabels, aDatasets) {
        const aDatasetsWithRenderingInformation = [...aDatasets];

        for(let i = 0; i < aDatasetsWithRenderingInformation.length; i++) {
            const oDataset = aDatasetsWithRenderingInformation[i];
            if(i == aDatasetsWithRenderingInformation.length - 1) {
                // undecided votes dataset
                oDataset.borderColor = UIComponents.POLL_TRENDS_CHART_UNDECIDED_LINE_COLOR;
            } else {
                oDataset.borderColor = UIComponents.POLL_TRENDS_CHART_LINE_COLORS[i];
            }

            oDataset.backgroundColor = oDataset.borderColor + this.POLL_TRENDS_CHART_DATASET_BACKGROUND_COLOR_OPACITY;
            oDataset.tension = 0.1;
        }

        return {
            type: 'line',
            data: {
              labels: aLabels,
              datasets: aDatasetsWithRenderingInformation
            },
            options: {
                aspectRatio: 0.6,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'white',
                            callback: function (sValue) {
                                return sValue + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(oTooltipItems) {
                                const sLabel = oTooltipItems[0].label || '';
                                return sLabel.split(',').join(', ');
                            },
                            labelColor: function(oTooltipContext) {
                                let sHexColorWithOpacity = oTooltipContext.dataset.backgroundColor || '';
                                const sHexColorWithoutOpacity = sHexColorWithOpacity.substring(0, sHexColorWithOpacity.length - 2);
                                return {
                                    backgroundColor: sHexColorWithoutOpacity
                                }
                            },
                            label: function(oTooltipContext) {
                                let sLabel = oTooltipContext.dataset.label || '';
        
                                if (sLabel) {
                                    sLabel += ': ';
                                }
                                if (oTooltipContext.parsed.y !== null) {
                                    sLabel += oTooltipContext.parsed.y + '%';
                                }
                                return sLabel;
                            }
                        }
                    }
                }
            }
        };
    }
}