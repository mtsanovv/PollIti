package com.mtsan.polliti.dto;

public class SocialLinksDto {
    private String facebook;
    private String instagram;

    public SocialLinksDto(String facebook, String instagram) {
        this.facebook = facebook;
        this.instagram = instagram;
    }

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }
}
