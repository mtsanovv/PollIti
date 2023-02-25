package com.mtsan.polliti.service;

import com.mtsan.polliti.component.AuthenticationFacade;
import com.mtsan.polliti.dao.PollLogDao;
import com.mtsan.polliti.dto.poll.PollLogDto;
import com.mtsan.polliti.dto.user.AuthenticatedUserDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.global.ValidationMessages;
import com.mtsan.polliti.model.PollLog;
import com.mtsan.polliti.util.ModelMapperWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;

@Service
public class PollLogService {
    private final PollLogDao pollLogDao;
    private final ModelMapperWrapper modelMapper;
    private final AuthenticationFacade authenticationFacade;
    private final UserService userService;

    @Autowired
    public PollLogService(PollLogDao pollLogDao, ModelMapperWrapper modelMapper, AuthenticationFacade authenticationFacade, UserService userService) {
        this.pollLogDao = pollLogDao;
        this.modelMapper = modelMapper;
        this.authenticationFacade = authenticationFacade;
        this.userService = userService;
    }

    public List<PollLogDto> getPollsLogs() {
        if(this.pollLogDao.count() == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ValidationMessages.NO_POLLS_LOGS_FOUND);
        }
        List<PollLogDto> pollLogDtoList = this.modelMapper.mapList(this.pollLogDao.findAll(), PollLogDto.class);
        Collections.reverse(pollLogDtoList);
        return pollLogDtoList;
    }

    public void logPollCreated(Long pollId, String pollTitle) {
        String pollCreatedMessagePart = String.format(Globals.POLLITI_POLL_ACTION_LOG_POLL_CREATED_PART_MESSAGE_FORMAT, pollTitle, pollId);
        this.insertLog(pollCreatedMessagePart);
    }

    public void logPollDeleted(Long pollId, String pollTitle) {
        String pollDeletedMessagePart = String.format(Globals.POLLITI_POLL_ACTION_LOG_POLL_DELETED_PART_MESSAGE_FORMAT, pollTitle, pollId);
        this.insertLog(pollDeletedMessagePart);
    }

    public void logPollSharedToFacebook(Long pollId, String pollTitle) {
        String pollSharedMessagePart = String.format(Globals.POLLITI_POLL_ACTION_LOG_POLL_SHARED_TO_FB_PART_MESSAGE_FORMAT, pollTitle, pollId);
        this.insertLog(pollSharedMessagePart);
    }

    public void logPollSharedToFacebookAndInstagram(Long pollId, String pollTitle) {
        String pollSharedMessagePart = String.format(Globals.POLLITI_POLL_ACTION_LOG_POLL_SHARED_TO_FB_AND_INSTA_PART_MESSAGE_FORMAT, pollTitle, pollId);
        this.insertLog(pollSharedMessagePart);
    }

    public void logPollInvitationSent(String email, Long pollId, String pollTitle) {
        String pollInvitationSentMessagePart = String.format(Globals.POLLITI_POLL_ACTION_LOG_SENT_POLL_INVITATION_PART_MESSAGE_FORMAT, email, pollTitle, pollId);
        this.insertLog(pollInvitationSentMessagePart);
    }

    public void logPollOptionVotesIncrementedManually(String pollOption, Long pollId, String pollTitle) {
        String pollOptionVotesIncrementedManuallyMessagePart = String.format(Globals.POLLITI_POLL_ACTION_LOG_MANUALLY_INCREMENTED_VOTES_PART_MESSAGE_FORMAT,
                                                                             pollOption, pollTitle, pollId);
        this.insertLog(pollOptionVotesIncrementedManuallyMessagePart);
    }

    public void logPollOptionVotesIncrementedByInvitation(String email, String pollOption, Long pollId, String pollTitle) {
        String pollOptionVotesIncrementedByInvitationMessagePart = String.format(Globals.POLLITI_POLL_ACTION_LOG_INCREMENTED_VOTES_COUNT_PART_MESSAGE_FORMAT,
                pollOption, pollTitle, pollId);
        this.insertLog(email, pollOptionVotesIncrementedByInvitationMessagePart);
    }

    private void insertLog(String email, String message) {
        PollLog pollLog = new PollLog();
        String logMessage = email == null ? this.getAuthenticatedUserLogMessage(message) : this.getAnonymousUserLogMessage(email, message);
        pollLog.setMessage(logMessage);
        pollLog.setTimestamp(Timestamp.valueOf(LocalDateTime.now(ZoneOffset.UTC)));
        this.pollLogDao.save(pollLog);
    }

    private void insertLog(String message) {
        this.insertLog(null, message);
    }

    private String getAuthenticatedUserLogMessage(String message) {
        Authentication authentication = authenticationFacade.getAuthentication();
        AuthenticatedUserDto authenticatedUserDto = this.userService.getAuthenticatedUser(authentication);
        return String.format(Globals.POLLITI_POLL_ACTION_USER_LOG_MESSAGE_FORMAT, authenticatedUserDto.getRole().toString(),
                             authenticatedUserDto.getUsername(), message);
    }

    private String getAnonymousUserLogMessage(String email, String message) {
        return String.format(Globals.POLLITI_POLL_ACTION_LOG_INVITATION_INCREMENTED_VOTES_MESSAGE_FORMAT, email, message);
    }
}
