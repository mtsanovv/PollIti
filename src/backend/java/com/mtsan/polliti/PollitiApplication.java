package com.mtsan.polliti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PollitiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PollitiApplication.class, args);
	}

}
