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
    static POLLS_TOKENS_BACKEND_ENDPOINT = '/polls/tokens';
    static MODEL_PATH_KEY = 'obj';
    static MODEL_PATH = '/' + this.MODEL_PATH_KEY;
}