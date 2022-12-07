package com.mtsan.polliti.global;

public class Routes {
    public static final String MAIN_USERS_ROUTE = "/users";
    public static final String USERS_ROUTE_SUBROUTES = String.format("%s/*", MAIN_USERS_ROUTE);

    public static final String MAIN_POLLS_TOKENS_ROUTE = "/polls/tokens";
    public static final String POLLS_TOKENS_ROUTE_SUBROUTES = String.format("%s/*", MAIN_POLLS_TOKENS_ROUTE);

    public static final String ME_ROUTE = "/me";

    public static final String LOGOUT_ROUTE = "/logout";

    public static final String LOGIN_ROUTE = "/login";

    public static final String ERROR_ROUTE = "/error"; // it has to be the same as the one in application.properties
}
