package com.mtsan.polliti.config;

import com.mtsan.polliti.dto.ExceptionDto;
import com.mtsan.polliti.dto.poll.PollDto;
import com.mtsan.polliti.dto.poll.PollLogDto;
import com.mtsan.polliti.dto.poll.PollTitleWithOptionsDto;
import com.mtsan.polliti.dto.poll.PollVotesDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.model.Poll;
import com.mtsan.polliti.model.PollLog;
import com.mtsan.polliti.model.PollOption;
import com.mtsan.polliti.util.ModelMapperWrapper;
import org.modelmapper.Converter;
import org.modelmapper.TypeMap;
import org.modelmapper.spi.MappingContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Timestamp;
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
        this.declareModelMappings();
    }

    private void declareModelMappings() {
        // invoke all methods of this instance that start with the 'map' prefix
        Method[] classMethods = ModelMappingsConfig.class.getDeclaredMethods();
        for(Method classMethod : classMethods) {
            if(classMethod.getName().startsWith("map")) {
                try {
                    classMethod.invoke(this);
                } catch (IllegalAccessException | InvocationTargetException ignored) {
                    // unnecessary exception catch
                }
            }
        }
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

        propertyMapper.addMappings(
            mapper -> mapper.using(pollOptionsToHashMapWithResults).map(Poll::getPollOptions, PollVotesDto::setOptionsVotes)
        );
    }

    private void mapPollModelToPollTitleWithOptionsDto() {
        TypeMap<Poll, PollTitleWithOptionsDto> propertyMapper = this.modelMapper.createTypeMap(Poll.class, PollTitleWithOptionsDto.class);
        Converter<List<PollOption>, List<String>> pollOptionsToListOfStrings = this::getPollOptionsAsListOfStrings;
        propertyMapper.addMapping(Poll::getTitle, PollTitleWithOptionsDto::setPollTitle);
        propertyMapper.addMappings(
            mapper -> mapper.using(pollOptionsToListOfStrings).map(Poll::getPollOptions, PollTitleWithOptionsDto::setPollOptions)
        );
    }

    private void mapPollModelToPollDto() {
        TypeMap<Poll, PollDto> propertyMapper = this.modelMapper.createTypeMap(Poll.class, PollDto.class);
        Converter<List<PollOption>, List<String>> pollOptionsToListOfStrings = this::getPollOptionsAsListOfStrings;

        propertyMapper.addMappings(
            mapper -> mapper.using(pollOptionsToListOfStrings).map(Poll::getPollOptions, PollDto::setOptions)
        );
    }

    private void mapPollLogModelToPollLogDto() {
        TypeMap<PollLog, PollLogDto> propertyMapper = this.modelMapper.createTypeMap(PollLog.class, PollLogDto.class);
        Converter<Timestamp, String> timestampStringConverter = c -> String.format(Globals.POLLITI_POLL_ACTION_LOG_TIMESTAMP_FORMAT, c.getSource());

        propertyMapper.addMappings(
            mapper -> mapper.using(timestampStringConverter).map(PollLog::getTimestamp, PollLogDto::setTimestamp)
        );
    }

    private List<String> getPollOptionsAsListOfStrings(MappingContext<List<PollOption>, List<String>> mappingContext) {
        List<String> options = new ArrayList<>();
        for(PollOption pollOption : mappingContext.getSource()) {
            options.add(pollOption.getTitle());
        }
        return options;
    }
}
