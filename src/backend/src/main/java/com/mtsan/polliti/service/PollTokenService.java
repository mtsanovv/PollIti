package com.mtsan.polliti.service;

import com.mtsan.polliti.dao.PollDao;
import com.mtsan.polliti.dao.PollInviteeDao;
import com.mtsan.polliti.dao.PollTokenDao;
import com.mtsan.polliti.dto.EmailDto;
import com.mtsan.polliti.dto.poll.PollTitleWithOptionsDto;
import com.mtsan.polliti.dto.poll.PollVoteForOptionDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.global.ValidationMessages;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollInvitee;
import com.mtsan.polliti.model.PollToken;
import com.mtsan.polliti.util.ModelMapperWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class PollTokenService {
    private final PollTokenDao pollTokenDao;
    private final PollInviteeDao pollInviteeDao;
    private final PollDao pollDao;
    private final PollService pollService;
    private final MailService mailService;
    private final PollLogService pollLogService;
    private final ModelMapperWrapper modelMapper;
    @Value("${agency.polliti-origin}")
    private String pollItiOrigin;
    @Value("${agency.name}")
    private String agencyName;

    @Autowired
    public PollTokenService(PollTokenDao pollTokenDao, PollInviteeDao pollInviteeDao, PollDao pollDao, PollService pollService, MailService mailService,
                            PollLogService pollLogService, ModelMapperWrapper modelMapper) {
        this.pollTokenDao = pollTokenDao;
        this.pollInviteeDao = pollInviteeDao;
        this.pollDao = pollDao;
        this.pollService = pollService;
        this.mailService = mailService;
        this.pollLogService = pollLogService;
        this.modelMapper = modelMapper;
    }

    public Date getCurrentDate() {
        return Date.valueOf(LocalDate.now(ZoneOffset.UTC));
    }

    @Scheduled(cron = Globals.POLL_TOKEN_PURGE_CRON_EXPRESSION, zone = Globals.POLL_TOKEN_PURGE_CRON_TIMEZONE)
    public void purgeExpiredTokens() {
        List<PollToken> expiredTokens = this.pollTokenDao.findAllExpiredBy(this.getCurrentDate());
        for(PollToken pollToken : expiredTokens) {
            this.pollInviteeDao.deleteById(pollToken.getInvitee().getId());
            // this should automatically delete the token as well due to the on delete cascade constraint in the DB
        }
    }

    public void createTokenAndSendItViaEmail(Long pollId, EmailDto emailDto) throws MessagingException {
        String email = emailDto.getEmail();
        Poll poll = this.pollDao.findById(pollId).get();
        String pollTitle = poll.getTitle();

        if(this.pollInviteeDao.getInviteesCountByEmailAndPollId(email, poll) >= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format(ValidationMessages.POLL_TOKEN_ALREADY_SENT, email));
        }

        PollToken pollToken = this.createPollToken(email, poll);
        this.sendTokenToEmail(pollToken, pollTitle, email);
        this.pollLogService.logPollInvitationSent(email, pollId, pollTitle);
    }

    public PollTitleWithOptionsDto getPollTitleWithOptionsByToken(UUID token) {
        this.verifyThatPollTokenExists(token);
        Poll poll = this.pollTokenDao.findById(token).get().getInvitee().getPoll();
        return this.modelMapper.map(poll, PollTitleWithOptionsDto.class);
    }

    public void incrementUndecidedVotes(UUID token) {
        this.verifyThatPollTokenExists(token);
        PollToken pollToken = this.pollTokenDao.findById(token).get();
        PollInvitee pollInvitee = pollToken.getInvitee();
        Poll poll = pollInvitee.getPoll();
        Long pollId = poll.getId();
        this.pollService.incrementUndecidedVotes(pollId, true);

        this.pollLogService.logPollOptionVotesIncrementedByInvitation(pollInvitee.getEmail(), Globals.UNDECIDED_VOTES_OPTION_NAME, pollId, poll.getTitle());

        this.pollTokenDao.deleteById(token);
    }

    public void incrementVotesForOption(UUID token, PollVoteForOptionDto pollVoteForOptionDto) {
        this.verifyThatPollTokenExists(token);
        PollToken pollToken = this.pollTokenDao.findById(token).get();
        PollInvitee pollInvitee = pollToken.getInvitee();
        Poll poll = pollInvitee.getPoll();
        Long pollId = poll.getId();
        this.pollService.incrementVotesForOption(pollId, pollVoteForOptionDto, true);

        this.pollLogService.logPollOptionVotesIncrementedByInvitation(pollInvitee.getEmail(), pollVoteForOptionDto.getTitle(), pollId, poll.getTitle());

        this.pollTokenDao.deleteById(token);
    }

    private void verifyThatPollTokenExists(UUID token) {
        if(this.pollTokenDao.getTokenCountByUuidAndExpiryDate(token, this.getCurrentDate()) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format(ValidationMessages.POLL_TOKEN_POLL_EXPIRED_OR_INVALID_MESSAGE));
        }
    }

    private PollToken createPollToken(String email, Poll poll) {
        Date nextWeek = Date.valueOf(LocalDate.now(ZoneOffset.UTC).plus(Globals.POLL_TOKEN_WEEKS_BEFORE_IT_EXPIRES, ChronoUnit.WEEKS));

        PollInvitee newPollInvitee = new PollInvitee(email, poll);
        this.pollInviteeDao.save(newPollInvitee);

        PollToken newPollToken = new PollToken(nextWeek, newPollInvitee);
        return this.pollTokenDao.save(newPollToken);
    }

    private void sendTokenToEmail(PollToken pollToken, String pollTitle, String email) throws MessagingException {
        String emailMessage = this.getTokenEmailMessageText(pollToken, pollTitle);
        this.mailService.sendMimeMessage(email, Globals.POLL_TOKEN_EMAIL_MESSAGE_SUBJECT, emailMessage);
    }

    private String getTokenEmailMessageText(PollToken pollToken, String pollTitle) {
        String pollTokenUrl = String.format(
            Globals.POLLITI_FRONTEND_POLLS_APP_TOKEN_URL_FORMAT,
            this.pollItiOrigin,
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
