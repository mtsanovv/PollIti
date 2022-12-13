package com.mtsan.polliti.service;

import com.mtsan.polliti.ModelMapperWrapper;
import com.mtsan.polliti.dao.PollDao;
import com.mtsan.polliti.dao.PollOptionDao;
import com.mtsan.polliti.dto.poll.NewPollDto;
import com.mtsan.polliti.dto.poll.PollDto;
import com.mtsan.polliti.dto.poll.option.NewPollOptionsDto;
import com.mtsan.polliti.global.ValidationMessages;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class PollService {
    private final PollDao pollDao;
    private final PollOptionDao pollOptionDao;
    private final ModelMapperWrapper modelMapper;

    @Autowired
    public PollService(PollDao pollDao, PollOptionDao pollOptionDao, ModelMapperWrapper modelMapper) {
        this.pollDao = pollDao;
        this.pollOptionDao = pollOptionDao;
        this.modelMapper = modelMapper;
    }

    public List<PollDto> getAllPolls() {
        if(this.pollDao.count() == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ValidationMessages.NO_POLLS_FOUND);
        }
        return this.modelMapper.mapList(this.pollDao.findAll(), PollDto.class);
    }

    public void createPoll(NewPollDto newPollDto) {
        Poll poll = this.modelMapper.map(newPollDto, Poll.class);
        poll.setUndecidedVotes(0L);
        this.pollDao.save(poll);
    }

    public void deletePoll(Long pollId) {
        if(!this.pollDao.existsById(pollId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format(ValidationMessages.POLL_NOT_FOUND, pollId));
        }
        this.pollDao.deleteById(pollId);
    }

    public void addOptionsToPoll(Long pollId, NewPollOptionsDto newPollOptionsDto) {
        if(!this.pollDao.existsById(pollId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format(ValidationMessages.POLL_NOT_FOUND, pollId));
        }
        Poll poll = this.pollDao.findById(pollId).get();
        if(poll.getPollOptions().size() > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format(ValidationMessages.POLL_OPTIONS_ALREADY_ADDED, pollId));
        }
        this.addPollOptions(poll, newPollOptionsDto.getOptions());
    }

    private void addPollOptions(Poll poll, List<String> options) {
        List<PollOption> pollOptions = new ArrayList<>();
        for(String option : options) {
            PollOption pollOption = new PollOption(option, poll);
            pollOptions.add(pollOption);
        }
        this.pollOptionDao.saveAll(pollOptions);
    }
}
