package com.mtsan.polliti.global;

public class Queries {
    public static final String LOGIN_USER_QUERY = "SELECT username, password, enabled FROM users WHERE username = ? AND enabled IS TRUE";
    public static final String LOGIN_USER_GET_AUTHORITIES_QUERY = "SELECT u.username, u.role FROM users u WHERE u.username = ?";

    public static final String USERDAO_FIND_USERS_BY_USERNAME_QUERY = "FROM User u WHERE u.username = ?1";
    public static final String USERDAO_COUNT_USERS_BY_USERNAME_QUERY = "SELECT COUNT(u) FROM User u WHERE u.username = ?1";
    public static final String USERDAO_DELETE_USER_BY_USERNAME_QUERY = "DELETE FROM User u WHERE u.username = ?1 ";

    public static final String POLLOPTIONDAO_FIND_POLL_OPTION_BY_TITLE_AND_POLL = "FROM PollOption po WHERE po.title = ?1 AND po.poll = ?2";

    public static final String POLLTOKENDAO_GET_TOKEN_BY_UUID_AND_EXPIRY_DATE_QUERY = "SELECT COUNT(pt) FROM PollToken pt WHERE pt.uuid = ?1 AND pt.expiresOn >= ?2";
    public static final String POLLTOKENDAO_DELETE_ALL_EXPIRED_BY_QUERY = "DELETE FROM PollToken pt WHERE pt.expiresOn < ?1";
}
