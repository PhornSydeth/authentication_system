package com.springsecurity.authsystem.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class OtpGenerator {
    public String generate(){
       int otp=ThreadLocalRandom.current().nextInt(0,10000);
       return String.format("%04d",otp);
    }
    public LocalDateTime expiry(){
        return LocalDateTime.now().plusMinutes(1);
    }
}
