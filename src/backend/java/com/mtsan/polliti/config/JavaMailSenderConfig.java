package com.mtsan.polliti.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class JavaMailSenderConfig {
    public JavaMailSender createJavaMailSender(@Value("${spring.mail.host}") String mailHost, @Value("${spring.mail.username}") String mailUsername,
                                               @Value("${spring.mail.password}") String mailPassword, @Value("${spring.mail.port}") int mailPort,
                                               @Value("${spring.mail.properties.mail.smtp.starttls.enable}") boolean mailStartTlsEnable) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);

        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        Properties mailSenderProperties = mailSender.getJavaMailProperties();
        mailSenderProperties.put("mail.transport.protocol", "smtp");
        mailSenderProperties.put("mail.smtp.auth", "true");
        mailSenderProperties.put("mail.smtp.starttls.enable", mailStartTlsEnable);

        return mailSender;
    }
}
