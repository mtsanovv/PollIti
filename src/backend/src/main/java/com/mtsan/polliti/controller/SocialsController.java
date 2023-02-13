package com.mtsan.polliti.controller;

import com.mtsan.polliti.dto.SocialLinksDto;
import com.mtsan.polliti.global.Routes;
import com.mtsan.polliti.service.MetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(Routes.SOCIALS_ROUTE)
@RestController
public class SocialsController {
    private final MetaService metaService;

    @Autowired
    public SocialsController(MetaService metaService) {
        this.metaService = metaService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<SocialLinksDto> getSocialLinks() {
        return ResponseEntity.status(HttpStatus.OK).body(this.metaService.getSocialLinks());
    }
}
