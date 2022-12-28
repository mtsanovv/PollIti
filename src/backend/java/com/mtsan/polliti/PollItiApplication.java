package com.mtsan.polliti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PollItiApplication {

    public static void main(String[] args) {
        SpringApplication.run(PollItiApplication.class, args);
    }

}
