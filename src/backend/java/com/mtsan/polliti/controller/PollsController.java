package com.mtsan.polliti.controller;

import com.mtsan.polliti.dto.EmailDto;
import com.mtsan.polliti.dto.IdDto;
import com.mtsan.polliti.dto.poll.*;
import com.mtsan.polliti.global.Routes;
import com.mtsan.polliti.service.PollService;
import com.mtsan.polliti.service.PollSocialSharingService;
import com.mtsan.polliti.service.PollTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RequestMapping(Routes.MAIN_POLLS_ROUTE)
@RestController
public class PollsController {
    private final PollService pollService;
    private final PollSocialSharingService pollSocialSharingService;
    private final PollTokenService pollTokenService;

    @Autowired
    public PollsController(PollService pollService, PollSocialSharingService pollSocialSharingService, PollTokenService pollTokenService) {
        this.pollService = pollService;
        this.pollSocialSharingService = pollSocialSharingService;
        this.pollTokenService = pollTokenService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<PollDto>> getPolls() {
        return ResponseEntity.status(HttpStatus.OK).body(this.pollService.getAllPolls());
    }

    @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity<IdDto> createPoll(@Valid @RequestBody NewPollDto newPollDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.pollService.createPoll(newPollDto));
    }

    @RequestMapping(value = "/{pollId}", method = RequestMethod.GET)
    public ResponseEntity<PollDto> getPollById(@PathVariable Long pollId) {
        return ResponseEntity.status(HttpStatus.OK).body(this.pollService.getPollById(pollId));
    }

    @RequestMapping(value = "/{pollId}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deletePoll(@PathVariable Long pollId) {
        this.pollService.deletePoll(pollId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @RequestMapping(value = "/{pollId}/options", consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity<Void> addPollOptions(@PathVariable Long pollId, @Valid @RequestBody NewPollOptionsDto newPollOptionsDto) {
        this.pollService.addOptionsToPoll(pollId, newPollOptionsDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}/votes", method = RequestMethod.GET)
    public ResponseEntity<PollVotesDto> getPollVotes(@PathVariable Long pollId) {
        return ResponseEntity.status(HttpStatus.OK).body(this.pollService.getPollVotes(pollId));
    }

    @RequestMapping(value = "/{pollId}/votes/undecided", method = RequestMethod.POST)
    public ResponseEntity<Void> incrementUndecidedVotes(@PathVariable Long pollId) {
        this.pollService.incrementUndecidedVotes(pollId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}/votes/option", consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity<Void> incrementVotesForOption(@PathVariable Long pollId, @Valid @RequestBody PollVoteForOptionDto pollVoteForOptionDto) {
        this.pollService.incrementVotesForOption(pollId, pollVoteForOptionDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}/votes/sharing/facebook", method = RequestMethod.POST)
    public ResponseEntity<Void> shareToFacebook(@PathVariable Long pollId) throws ExecutionException, InterruptedException {
        this.pollSocialSharingService.sharePollResultsToFacebook(pollId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}/votes/sharing/facebookAndInstagram", method = RequestMethod.POST)
    public ResponseEntity<Void> shareToFacebookAndInstagram(@PathVariable Long pollId) throws ExecutionException, InterruptedException {
        // since Instagram cannot have a binary attachment like facebook, we need to use a jpeg url as defined by their graph api docs
        // in order to avoid any extra services & external image hosting shenanigans, one can just post in parallel to both platforms
        // basically, the facebook jpg image url is used for the Instagram upload
        // unfortunately, this leads to Instagram overcompressing the image, but it is what it is
        this.pollSocialSharingService.sharePollResultsToFacebookAndInstagram(pollId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}/tokens", consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity<Void> createPollTokenAndSendItViaEmail(@PathVariable Long pollId, @Valid @RequestBody EmailDto emailDto) throws MessagingException {
        this.pollTokenService.createTokenAndSendItViaEmail(pollId, emailDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
