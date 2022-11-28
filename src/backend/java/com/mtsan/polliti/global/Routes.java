package com.mtsan.polliti.global;

public class Routes {
    public static final String MAIN_USERS_ROUTE = "/users";
    public static final String USERS_ROUTE_SUBROUTES = String.format("%s/*", MAIN_USERS_ROUTE);

    public static final String MAIN_SURVEYS_ROUTE = "/surveys";
    public static final String SURVEYS_ROUTE_SUBROUTES = String.format("%s/*", MAIN_SURVEYS_ROUTE);

    public static final String MAIN_USER_ROUTE = "/user";
    public static final String USER_LOGOUT_SUBROUTE = String.format("%s/logout", MAIN_USER_ROUTE);

    public static final String LOGIN_ROUTE = "/login";

    public static final String ERROR_ROUTE = "/error"; // it has to be the same as the one in application.properties
}
