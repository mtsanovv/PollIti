package com.mtsan.polliti.service;

import com.mtsan.polliti.dao.PollDao;
import com.mtsan.polliti.dao.PollTokenDao;
import com.mtsan.polliti.dto.EmailDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.global.Routes;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@Service
public class PollTokenService {
    private final PollTokenDao pollTokenDao;
    private final PollDao pollDao;
    private final PollService pollService;
    private final MailService mailService;
    @Value("${agency.polliti-origin}")
    private String pollItiOrigin;
    @Value("${agency.name}")
    private String agencyName;

    @Autowired
    public PollTokenService(PollTokenDao pollTokenDao, PollDao pollDao, PollService pollService, MailService mailService) {
        this.pollTokenDao = pollTokenDao;
        this.pollDao = pollDao;
        this.pollService = pollService;
        this.mailService = mailService;
    }

    public void createTokenAndSendItViaEmail(Long pollId, EmailDto emailDto) throws MessagingException {
        String pollTitle = this.pollService.getPollTitleById(pollId);
        PollToken pollToken = this.createPollToken(pollId);
        this.sendTokenToEmail(pollToken, pollTitle, emailDto.getEmail());
    }

    private PollToken createPollToken(Long pollId) {
        Poll poll = this.pollDao.findById(pollId).get();
        Date nextWeek = Date.valueOf(LocalDate.now(ZoneOffset.UTC).plus(Globals.POLL_TOKEN_WEEKS_BEFORE_IT_EXPIRES, ChronoUnit.WEEKS));
        PollToken newPollToken = new PollToken(nextWeek, poll);
        return this.pollTokenDao.save(newPollToken);
    }

    private void sendTokenToEmail(PollToken pollToken, String pollTitle, String email) throws MessagingException {
        String emailMessage = this.getTokenEmailMessageText(pollToken, pollTitle);
        this.mailService.sendMimeMessage(email, Globals.POLL_TOKEN_EMAIL_MESSAGE_SUBJECT, emailMessage);
    }

    private String getTokenEmailMessageText(PollToken pollToken, String pollTitle) {
        String pollTokenUrl = String.format(
            "%s%s/%s",
            this.pollItiOrigin,
            Routes.MAIN_POLLS_ROUTE,
            pollToken.getUuid()
        );
        return String.format(
            Globals.POLL_TOKEN_EMAIL_MESSAGE,
            this.agencyName,
            pollTitle,
            pollTokenUrl,
            pollTokenUrl,
            pollToken.getExpiresOn().toString(),
            this.agencyName
        );
    }
}
