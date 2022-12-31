class Globals {
    static POLLITI_COMPONENT_METADATA = {
        rootView: {
            viewName: UIComponents.POLLITI_VIEW_MAIN,
            type: "JS",
            async: true,
            id: UIComponents.POLLITI_VIEW_MAIN
        }
    };

    static TOKEN_QUERY_PARAM = 'token';
    static TITLE_REQUEST_BODY_PARAM = 'title';

    static URI_DELIMITER = '/';
    static HTML_PAGE_TITLE_DELIMITER = ' | ';

    static POLLS_TOKENS_BACKEND_ENDPOINT = ['polls', 'tokens'].join(this.URI_DELIMITER);
    static VOTES_UNDECIDED_ENDPOINT_SUFFIX = ['votes', 'undecided'].join(this.URI_DELIMITER);
    static VOTES_OPTION_ENDPOINT_SUFFIX = ['votes', 'option'].join(this.URI_DELIMITER);

    static MODEL_PATH_KEY = 'obj';
    static MODEL_PATH = this.URI_DELIMITER + this.MODEL_PATH_KEY;

    static UNDECIDED_OPTION = 'Undecided';
    static SUBMIT_BUTTON_TEXT = 'Submit';
}