package com.springsecurity.authsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class WebConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration config=new CorsConfiguration();
        //React dev server to allow React talk to spring boot
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        //Http method for react front-end
        config.setAllowedMethods(List.of(
                "GET","POST","PUT","DELETE","OPTIONS"
        ));
        //Header React will send
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type"
        ));
        //Header expose to react
        config.setExposedHeaders(List.of(
                "Authorization"
        ));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",config);
        return source;
    }
}
