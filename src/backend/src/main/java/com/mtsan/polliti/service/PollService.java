package com.mtsan.polliti.service;

import com.mtsan.polliti.dao.PollDao;
import com.mtsan.polliti.dao.PollOptionDao;
import com.mtsan.polliti.dto.IdDto;
import com.mtsan.polliti.dto.poll.NewPollDto;
import com.mtsan.polliti.dto.poll.PollDto;
import com.mtsan.polliti.dto.poll.PollVoteForOptionDto;
import com.mtsan.polliti.dto.poll.PollVotesDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.global.ValidationMessages;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollOption;
import com.mtsan.polliti.util.ModelMapperWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;

@Service
public class PollService {
    private final PollDao pollDao;
    private final PollOptionDao pollOptionDao;
    private final ModelMapperWrapper modelMapper;
    private final PollLogService pollLogService;

    @Autowired
    public PollService(PollDao pollDao, PollOptionDao pollOptionDao, ModelMapperWrapper modelMapper, PollLogService pollLogService) {
        this.pollDao = pollDao;
        this.pollOptionDao = pollOptionDao;
        this.modelMapper = modelMapper;
        this.pollLogService = pollLogService;
    }

    public List<PollDto> getAllPolls() {
        if(this.pollDao.count() == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ValidationMessages.NO_POLLS_FOUND);
        }
        List<PollDto> pollDtoList = this.modelMapper.mapList(this.pollDao.findAll(), PollDto.class);
        Collections.reverse(pollDtoList);
        return pollDtoList;
    }

    public IdDto createPoll(NewPollDto newPollDto) {
        Poll poll = this.modelMapper.map(newPollDto, Poll.class);
        poll.setUndecidedVotes(0L);
        poll.setCreationDate(Date.valueOf(LocalDate.now(ZoneOffset.UTC)));
        Poll savedPollWithId = this.pollDao.save(poll);
        this.savePollOptions(poll, newPollDto.getOptions());

        this.pollLogService.logPollCreated(savedPollWithId.getId(), savedPollWithId.getTitle());

        return this.modelMapper.map(savedPollWithId, IdDto.class);
    }

    public void deletePoll(Long pollId) {
        this.verifyThatPollIdExists(pollId);
        String pollTitle = this.pollDao.findById(pollId).get().getTitle();
        this.pollDao.deleteById(pollId);
        this.pollLogService.logPollDeleted(pollId, pollTitle);
    }

    public PollVotesDto getPollVotes(Long pollId) {
        this.verifyThatPollIdExists(pollId);
        Poll poll = this.pollDao.findById(pollId).get();
        return this.modelMapper.map(poll, PollVotesDto.class);
    }

    public PollDto getPollById(Long pollId) {
        this.verifyThatPollIdExists(pollId);
        Poll poll = this.pollDao.findById(pollId).get();
        return this.modelMapper.map(poll, PollDto.class);
    }

    public String getPollTitleById(Long pollId) {
        return this.getPollById(pollId).getTitle();
    }

    public PollVotesDto getPollVotesThatMeetThresholdPercentage(Long pollId) {
        this.verifyThatPollIdExists(pollId);
        Poll poll = this.pollDao.findById(pollId).get();
        PollVotesDto pollVotesDto = this.modelMapper.map(poll, PollVotesDto.class);
        this.filterPollOptionsByThresholdPercentage(pollVotesDto.getOptionsVotes(), pollVotesDto.getUndecidedVotes(), poll.getThreshold());
        return pollVotesDto;
    }

    public void incrementUndecidedVotes(Long pollId, boolean isViaToken) {
        this.verifyThatPollIdExists(pollId);
        Poll poll = this.pollDao.findById(pollId).get();
        poll.setUndecidedVotes(poll.getUndecidedVotes() + 1);
        this.pollDao.save(poll);

        if(!isViaToken) {
            this.pollLogService.logPollOptionVotesIncrementedManually(Globals.UNDECIDED_VOTES_OPTION_NAME, pollId, poll.getTitle());
        }
    }

    public void incrementUndecidedVotes(Long pollId) {
        this.incrementUndecidedVotes(pollId, false);
    }

    public void incrementVotesForOption(Long pollId, PollVoteForOptionDto pollVoteForOptionDto, boolean isViaToken) {
        this.verifyThatPollIdExists(pollId);

        String optionTitle = pollVoteForOptionDto.getTitle();
        Poll poll = this.pollDao.findById(pollId).get();
        List<PollOption> optionsWithGivenTitleAndPollId = this.pollOptionDao.getPollOptionByTitleAndPollId(optionTitle, poll);

        if(optionsWithGivenTitleAndPollId.size() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format(ValidationMessages.POLL_OPTION_NOT_FOUND, optionTitle, pollId));
        }

        PollOption optionWhoseVotesToIncrement = optionsWithGivenTitleAndPollId.get(0);
        optionWhoseVotesToIncrement.setVotes(optionWhoseVotesToIncrement.getVotes() + 1);
        this.pollOptionDao.save(optionWhoseVotesToIncrement);

        if(!isViaToken) {
            this.pollLogService.logPollOptionVotesIncrementedManually(optionWhoseVotesToIncrement.getTitle(), pollId, poll.getTitle());
        }
    }

    public void incrementVotesForOption(Long pollId, PollVoteForOptionDto pollVoteForOptionDto) {
        this.incrementVotesForOption(pollId, pollVoteForOptionDto, false);
    }

    public void verifyThatPollIdExists(Long pollId) {
        if(!this.pollDao.existsById(pollId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format(ValidationMessages.POLL_NOT_FOUND, pollId));
        }
    }

    private void filterPollOptionsByThresholdPercentage(LinkedHashMap<String, Long> pollOptionsVotes, Long undecidedVotes, Byte threshold) {
        Long totalPollVotes = this.sumPollVotes(pollOptionsVotes.values(), undecidedVotes, true);
        pollOptionsVotes.entrySet().removeIf(entry -> (double) entry.getValue() / totalPollVotes * 100.0 < threshold);
    }

    public Long sumPollVotes(Iterable<Long> pollOptionsVotes, Long undecidedVotes) {
        Long totalVotesForAllOptions = undecidedVotes;
        for(Long votes : pollOptionsVotes) {
            totalVotesForAllOptions += votes;
        }
        return totalVotesForAllOptions;
    }

    private Long sumPollVotes(Iterable<Long> pollOptionsVotes, Long undecidedVotes, Boolean setToOneIfZero) {
        Long totalPollVotes = this.sumPollVotes(pollOptionsVotes, undecidedVotes);
        if(setToOneIfZero && totalPollVotes == 0) {
            return 1L;
        }
        return totalPollVotes;
    }

    public double getOptionSharePercentage(Long votesForOption, Long sumOfAllVotes) {
        if(sumOfAllVotes == 0) {
            sumOfAllVotes = 1L;
        }
        double ratio = (double) votesForOption / sumOfAllVotes;
        double percentage = ratio * 100;
        return Math.round(percentage * 10.0) / 10.0;
    }

    public String getOptionSharePercentageWithSign(Long votesForOption, Long sumOfAllVotes) {
        return this.getOptionSharePercentage(votesForOption, sumOfAllVotes) + "%";
    }

    private void savePollOptions(Poll poll, List<String> options) {
        List<PollOption> pollOptions = new ArrayList<>();
        for(String option : options) {
            PollOption pollOption = new PollOption(option, poll);
            pollOptions.add(pollOption);
        }
        this.pollOptionDao.saveAll(pollOptions);
    }
}
