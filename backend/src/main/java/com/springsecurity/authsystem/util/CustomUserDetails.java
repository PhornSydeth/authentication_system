package com.springsecurity.authsystem.util;

import com.springsecurity.authsystem.model.User;
import com.springsecurity.authsystem.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetails implements UserDetailsService {
    private UserRepository userRepository;

    public CustomUserDetails(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
              User user=userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found!"));
        return new CustomUserDetailsService(user);
    }

}
