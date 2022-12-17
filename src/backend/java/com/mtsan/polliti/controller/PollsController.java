package com.mtsan.polliti.controller;

import com.mtsan.polliti.dto.poll.*;
import com.mtsan.polliti.global.Routes;
import com.mtsan.polliti.service.PollService;
import com.mtsan.polliti.service.PollSocialSharingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RequestMapping(Routes.MAIN_POLLS_ROUTE)
@RestController
public class PollsController {
    private final PollService pollService;
    private final PollSocialSharingService pollSocialSharingService;

    @Autowired
    public PollsController(PollService pollService, PollSocialSharingService pollSocialSharingService) {
        this.pollService = pollService;
        this.pollSocialSharingService = pollSocialSharingService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<PollDto>> getPolls() {
        return ResponseEntity.status(HttpStatus.OK).body(this.pollService.getAllPolls());
    }

    @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity<Void> createPoll(@Valid @RequestBody NewPollDto newPollDto) {
        this.pollService.createPoll(newPollDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
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
}
