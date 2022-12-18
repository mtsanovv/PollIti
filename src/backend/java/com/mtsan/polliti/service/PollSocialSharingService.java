package com.mtsan.polliti.service;

import com.mtsan.polliti.dto.poll.PollDto;
import com.mtsan.polliti.dto.poll.PollVotesDto;
import com.mtsan.polliti.global.Globals;
import com.mtsan.polliti.global.ValidationConstants;
import com.mtsan.polliti.global.ValidationMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.AbstractMap;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class PollSocialSharingService {
    private final PollService pollService;
    private final MetaService metaService;
    private final PollResultsChartGenerationService pollResultsChartGenerationService;
    @Value("${agency.name}")
    private String agencyName;

    @Autowired
    public PollSocialSharingService(PollService pollService, MetaService metaService, PollResultsChartGenerationService pollResultsChartGenerationService) {
        this.pollService = pollService;
        this.metaService = metaService;
        this.pollResultsChartGenerationService = pollResultsChartGenerationService;
    }

    public void sharePollResultsToFacebook(Long pollId) throws ExecutionException, InterruptedException {
        this.metaService.postImageWithTextToFacebook(
            this.getPollSocialPostText(pollId),
            this.pollResultsChartGenerationService.getPollResultsChartImage(pollId)
        );
    }

    public void sharePollResultsToFacebookAndInstagram(Long pollId) throws ExecutionException, InterruptedException {
        this.metaService.postImageWithTextToFacebookAndInstagram(
                this.getPollSocialPostText(pollId),
                this.pollResultsChartGenerationService.getPollResultsChartImage(pollId)
        );
    }

    private String getPollSocialPostText(Long pollId) {
        PollDto pollDto = this.pollService.getPollById(pollId);
        String pollTitle = pollDto.getTitle();
        Byte threshold = pollDto.getThreshold();
        PollVotesDto pollVotesDto = this.pollService.getPollVotesThatMeetThresholdPercentage(pollId);
        int pollOptionsThatMeetThreshold = pollVotesDto.getOptionsVotes().values().size();

        if(pollOptionsThatMeetThreshold < ValidationConstants.MIN_OPTIONS_THAT_MEET_THRESHOLD_IN_ORDER_TO_POST_TO_SOCIAL) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ValidationMessages.NOT_ENOUGH_OPTIONS_TO_POST_TO_SOCIAL_MEDIA);
        }

        if(threshold > 0) {
            return this.getPollSocialPostTextWithThreshold(pollTitle, pollOptionsThatMeetThreshold, threshold);
        }

        Map.Entry<String, String> mostPopularOptionWithSharePercentage = this.getMostPopularOptionWithSharePercentage(pollId);
        if(pollVotesDto.getOptionsVotes().get(mostPopularOptionWithSharePercentage.getKey()) == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ValidationMessages.NO_VOTES_TO_POST_TO_SOCIAL_MEDIA);
        }

        return this.getPollSocialPostTextNoThreshold(pollTitle, this.getMostPopularOptionWithSharePercentage(pollId));
    }

    private String getPollSocialPostTextWithThreshold(String pollTitle, int pollOptionsThatMeetThreshold, Byte threshold) {
        return String.format(
            Globals.SOCIAL_MEDIA_POST_TEMPLATE_WITH_THRESHOLD,
            this.agencyName,
            pollOptionsThatMeetThreshold,
            threshold,
            pollTitle
        );
    }

    private String getPollSocialPostTextNoThreshold(String pollTitle, Map.Entry<String, String> mostPopularOptionWithSharePercentage) {
        return String.format(
            Globals.SOCIAL_MEDIA_POST_TEMPLATE_NO_THRESHOLD,
            this.agencyName,
            mostPopularOptionWithSharePercentage.getValue(),
            mostPopularOptionWithSharePercentage.getKey(),
            pollTitle
        );
    }

    private Map.Entry<String, String> getMostPopularOptionWithSharePercentage(Long pollId) {
        PollVotesDto allPollVotes = this.pollService.getPollVotes(pollId);
        LinkedHashMap<String, Long> pollOptionsVotes = allPollVotes.getOptionsVotes();
        Long totalVotes = this.pollService.sumPollVotes(pollOptionsVotes.values(), allPollVotes.getUndecidedVotes());
        String optionWithMostVotes = Collections.max(pollOptionsVotes.entrySet(), Map.Entry.comparingByValue()).getKey();
        Long votesForTheMostPopularOption = pollOptionsVotes.get(optionWithMostVotes);
        return new AbstractMap.SimpleEntry<>(optionWithMostVotes, this.pollService.getOptionSharePercentage(votesForTheMostPopularOption, totalVotes));
    }
}
