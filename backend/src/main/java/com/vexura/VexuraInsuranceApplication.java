package com.vexura;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VexuraInsuranceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VexuraInsuranceApplication.class, args);
    }
}
