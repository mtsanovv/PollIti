package com.mtsan.polliti.service;

import com.mtsan.polliti.global.Globals;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Service
public class MailService {
    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;
    @Value("${agency.name}")
    private String agencyName;

    @Autowired
    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendMimeMessage(String to, String subject, String text) throws MessagingException {
        MimeMessage message = this.javaMailSender.createMimeMessage();
        message.setFrom(String.format(Globals.EMAIL_MESSAGE_FROM_HEADER, this.agencyName, this.fromEmail));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        message.setSubject(subject);
        message.setText(text, Globals.EMAIL_MESSAGE_ENCODING, Globals.EMAIL_MESSAGE_FORMAT);
        this.javaMailSender.send(message);
    }
}
