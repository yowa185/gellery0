package com.gallery0.demo.service;

import com.gallery0.demo.domain.User;
import com.gallery0.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class VisitorService {

    private final UserRepository userRepository;

    public VisitorService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User resolve(String visitorTokenHeader) {
        UUID token = UUID.fromString(visitorTokenHeader);
        return userRepository.findByVisitorToken(token)
                .orElseGet(() -> {
                    User user = new User();
                    user.setVisitorToken(token);
                    return userRepository.save(user);
                });
    }
}
