package com.mtsan.polliti.service;

import com.mtsan.polliti.global.Globals;
import com.restfb.BinaryAttachment;
import com.restfb.FacebookClient;
import com.restfb.Parameter;
import com.restfb.types.FacebookType;
import com.restfb.types.Page;
import com.restfb.types.Photo;
import com.restfb.types.instagram.IgUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class MetaService {
    private final FacebookClient facebookClient;
    @Value("${restfb.page.id}")
    private String pageId;

    @Autowired
    public MetaService(FacebookClient facebookClient) {
        this.facebookClient = facebookClient;
    }

    public FacebookType postImageWithTextToFacebook(String message, byte[] imageByteArray) {
        return this.facebookClient.publish(
            String.format(Globals.PUBLISH_TO_FACEBOOK_PHOTOS_TEMPLATE, pageId),
            FacebookType.class,
            BinaryAttachment.with(String.format("%d.%s", Instant.now().getEpochSecond(), Globals.CHART_IMAGE_FORMAT), imageByteArray),
            Parameter.with("message", message)
        );
    }
    public void postImageWithTextToFacebookAndInstagram(String message, byte[] imageByteArray) {
        // the idea for the parallel posting is described in PollsController, the comments here will serve the purpose of explaining the process
        // first, post to facebook, take the post ID - that actually represents a Photo object
        // the Photo object can have a picture & php link to the photo in it, but we don't need those
        // the images field contains an array of different sizes of images
        // the first element of that array is the original image size
        FacebookType photoPublishedResponse = this.postImageWithTextToFacebook(message, imageByteArray);
        String photoLink = this.facebookClient.fetchObject(
            photoPublishedResponse.getId(),
            Photo.class,
            Parameter.with("fields", "images")
        ).getImages().get(0).getSource();

        // we need to fetch the Facebook page details and get the instagram_business_account field
        // the response is represented by a Page object
        // then, on the Page object, we can call the getInstagramBusinessAccount method
        // this method returns an IgUser object that we don't really need, we just need its ID
        IgUser igUser = this.facebookClient.fetchObject(
            this.pageId,
            Page.class,
            Parameter.with("fields", "instagram_business_account")
        ).getInstagramBusinessAccount();

        // after the instagram business account ID and jpeg image url requirements are satisfied, we can post to Instagram
        // first, we need to create a media container by passing the image_url and caption parameters
        // then, the only field in the response should be the media container ID (or at least judging by the scarce Graph API documentation)
        // we can create a FacebookType object from the response because RestFB does not seem to have any specific object associated with media containers
        // after that, we just get the ID of the FacebookType object and pass it to the media_publish call
        // that should 'seal' the container and get the post live on Instagram
        FacebookType mediaContainer = this.facebookClient.publish(
            String.format(Globals.POST_TO_INSTAGRAM_MEDIA_TEMPLATE, igUser.getId()),
            FacebookType.class,
            Parameter.with("image_url", photoLink),
            Parameter.with("caption", message)
        );
        this.facebookClient.publish(
                String.format(Globals.PUBLISH_TO_INSTAGRAM_MEDIA_TEMPLATE, igUser.getId()),
            FacebookType.class,
            Parameter.with("creation_id", mediaContainer.getId())
        );
    }
}
