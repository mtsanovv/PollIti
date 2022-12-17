package com.mtsan.polliti.service;

import com.mtsan.polliti.global.Globals;
import com.restfb.BinaryAttachment;
import com.restfb.FacebookClient;
import com.restfb.Parameter;
import com.restfb.types.FacebookType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class FacebookService {
    private final FacebookClient facebookClient;
    @Value("${restfb.page.id}")
    private String pageId;

    @Autowired
    public FacebookService(FacebookClient facebookClient) {
        this.facebookClient = facebookClient;
    }

    public void postImageWithTextToFacebook(String message, byte[] imageByteArray) {
        this.facebookClient.publish(
            String.format(Globals.PUBLISH_TO_FACEBOOK_PHOTOS_TEMPLATE, pageId),
            FacebookType.class,
            BinaryAttachment.with(String.format("%d.%s", Instant.now().getEpochSecond(), Globals.CHART_IMAGE_FORMAT), imageByteArray),
            Parameter.with("message", message)
        );
    }
}
