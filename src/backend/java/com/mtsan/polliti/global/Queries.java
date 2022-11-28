package com.mtsan.polliti.global;

public class Queries {
    public static final String LOGIN_USER_QUERY = "SELECT username, password, enabled FROM users WHERE username = ? AND enabled IS TRUE";
    public static final String LOGIN_USER_GET_AUTHORITIES_QUERY = "SELECT u.username, u.role FROM users u WHERE u.username = ?";

    public static final String USERDAO_FIND_USERS_BY_USERNAME_QUERY = "FROM User u WHERE u.username = ?1";
    public static final String USERDAO_COUNT_USERS_BY_USERNAME_QUERY = "SELECT COUNT(u) FROM User u WHERE u.username = ?1";
    public static final String USERDAO_DELETE_USER_BY_USERNAME_QUERY = "DELETE FROM User u WHERE u.username = ?1 ";
}
