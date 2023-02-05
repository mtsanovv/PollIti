package com.mtsan.polliti.config;

import com.mtsan.polliti.dto.poll.PollTitleWithOptionsDto;
import com.mtsan.polliti.util.ModelMapperWrapper;
import com.mtsan.polliti.dto.ExceptionDto;
import com.mtsan.polliti.dto.poll.PollVotesDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollOption;
import org.modelmapper.Converter;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

@Configuration
public class ModelMappingsConfig {
    private final ModelMapperWrapper modelMapper;

    @Autowired
    public ModelMappingsConfig(ModelMapperWrapper modelMapper) {
        this.modelMapper = modelMapper;
        this.mapResponseStatusExceptionToExceptionDto();
        this.mapPollModelToPollVotesDto();
        this.mapPollModelToPollTitleWithOptionsDto();
    }

    private void mapResponseStatusExceptionToExceptionDto() {
        TypeMap<ResponseStatusException, ExceptionDto> propertyMapper = this.modelMapper.createTypeMap(ResponseStatusException.class, ExceptionDto.class);
        Converter<HttpStatus, String> responseStatusToString = c -> c.getSource() == null ? null : c.getSource().getReasonPhrase();
        Converter<String, HashMap<String, String>> reasonStringToHashMap = c -> {
            HashMap<String, String> exceptionContent = new HashMap<>();
            exceptionContent.put(Globals.ERROR_CONTENT_REASON, c.getSource());
            return exceptionContent;
        };
        propertyMapper.addMappings(
            mapper -> mapper.using(responseStatusToString).map(ResponseStatusException::getStatus, ExceptionDto::setError)
        );
        propertyMapper.addMappings(
            mapper -> mapper.using(reasonStringToHashMap).map(ResponseStatusException::getReason, ExceptionDto::setContent)
        );
    }

    private void mapPollModelToPollVotesDto() {
        TypeMap<Poll, PollVotesDto> propertyMapper = this.modelMapper.createTypeMap(Poll.class, PollVotesDto.class);

        Converter<List<PollOption>, HashMap<String, Long>> pollOptionsToHashMapWithResults = c -> {
            LinkedHashMap<String, Long> hashMapWithResults = new LinkedHashMap<>();
            for(PollOption pollOption : c.getSource()) {
                hashMapWithResults.put(pollOption.getTitle(), pollOption.getVotes());
            }
            return hashMapWithResults;
        };

        Converter<List<PollOption>, List<String>> listOfPollOptionsToListOfStrings = c -> {
            ArrayList<String> optionTitles = new ArrayList<>();
            for(PollOption pollOption : c.getSource()) {
                optionTitles.add(pollOption.getTitle());
            }
            return optionTitles;
        };

        propertyMapper.addMappings(
            mapper -> mapper.using(pollOptionsToHashMapWithResults).map(Poll::getPollOptions, PollVotesDto::setOptionsVotes)
        );

        propertyMapper.addMappings(
            mapper -> mapper.using(listOfPollOptionsToListOfStrings).map(Poll::getPollOptions, PollVotesDto::setOriginalOptionsListOrder)
        );
    }

    private void mapPollModelToPollTitleWithOptionsDto() {
        TypeMap<Poll, PollTitleWithOptionsDto> propertyMapper = this.modelMapper.createTypeMap(Poll.class, PollTitleWithOptionsDto.class);
        Converter<List<PollOption>, List<String>> pollOptionsToListOfStrings = c -> {
            List<String> options = new ArrayList<>();
            for(PollOption pollOption : c.getSource()) {
                options.add(pollOption.getTitle());
            }
            return options;
        };
        propertyMapper.addMapping(Poll::getTitle, PollTitleWithOptionsDto::setPollTitle);
        propertyMapper.addMappings(
            mapper -> mapper.using(pollOptionsToListOfStrings).map(Poll::getPollOptions, PollTitleWithOptionsDto::setPollOptions)
        );
    }
}
