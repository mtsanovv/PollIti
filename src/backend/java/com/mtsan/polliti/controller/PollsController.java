package com.mtsan.polliti.controller;

import com.mtsan.polliti.dto.poll.NewPollDto;
import com.mtsan.polliti.dto.poll.NewPollOptionsDto;
import com.mtsan.polliti.dto.poll.PollVoteForOptionDto;
import com.mtsan.polliti.global.Routes;
import com.mtsan.polliti.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequestMapping(Routes.MAIN_POLLS_ROUTE)
@RestController
public class PollsController {
    private final PollService pollService;

    @Autowired
    public PollsController(PollService pollService) {
        this.pollService = pollService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity getPolls() {
        return ResponseEntity.status(HttpStatus.OK).body(this.pollService.getAllPolls());
    }

    @RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity createPoll(@Valid @RequestBody NewPollDto newPollDto) {
        this.pollService.createPoll(newPollDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}", method = RequestMethod.DELETE)
    public ResponseEntity deletePoll(@PathVariable Long pollId) {
        this.pollService.deletePoll(pollId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @RequestMapping(value = "/{pollId}/options", consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity addPollOptions(@PathVariable Long pollId, @Valid @RequestBody NewPollOptionsDto newPollOptionsDto) {
        this.pollService.addOptionsToPoll(pollId, newPollOptionsDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}/votes", method = RequestMethod.GET)
    public ResponseEntity getPollVotes(@PathVariable Long pollId) {
        return ResponseEntity.status(HttpStatus.OK).body(this.pollService.getPollVotes(pollId));
    }

    @RequestMapping(value = "/{pollId}/votes/undecided", method = RequestMethod.POST)
    public ResponseEntity incrementUndecidedVotes(@PathVariable Long pollId) {
        this.pollService.incrementUndecidedVotes(pollId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @RequestMapping(value = "/{pollId}/votes/option", consumes = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.POST)
    public ResponseEntity incrementVotesForOption(@PathVariable Long pollId, @Valid @RequestBody PollVoteForOptionDto pollVoteForOptionDto) {
        this.pollService.incrementVotesForOption(pollId, pollVoteForOptionDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
