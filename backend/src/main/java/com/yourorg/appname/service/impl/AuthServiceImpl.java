package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.LoginRequest;
import com.yourorg.appname.dto.request.RegisterRequest;
import com.yourorg.appname.dto.response.AuthResponse;
import com.yourorg.appname.dto.response.UserResponse;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.security.JwtUtil;
import com.yourorg.appname.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EntityDtoMapper mapper;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            EntityDtoMapper mapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.mapper = mapper;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        UserResponse userResponse = mapper.toUserResponse(user);
        return new AuthResponse(token, userResponse);
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setAge(request.getAge() != null ? request.getAge() : 25);
        user.setCity(request.getCity() != null ? request.getCity() : "Wanderer City");
        user.setCountry(request.getCountry() != null ? request.getCountry() : "Global");
        user.setAvatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : "https://lh3.googleusercontent.com/aida-public/AB6AXuCOnj1GQYR9gtTXRzmQL8_wCs0_AelRfvSfZJqu8sPWwaVINdPD0tCtVdmwP1SHswocQDb6l7AH5h-ekkTdSBU1wfEriCisgWD05DzCObGT7V6ZH9aH1bb_SbFMjALgdg7jM5j2V45_Z8bDCZodbdJ24bTAKsMLSp-0bTT01s5osdwABfUGW4_TnJq_eft8DaxfeDwg4FbeWi5Ol-vWr7QO-ZzpZWlXzj52_rAG0nP3q-PpFt967DhM");
        user.setBio(request.getBio() != null ? request.getBio() : "Exploring the world with TripPartner.");
        user.setRole("ROLE_USER");
        user.setIsVerified(true);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateTokenFromEmail(savedUser.getEmail(), savedUser.getId(), savedUser.getFullName());
        UserResponse userResponse = mapper.toUserResponse(savedUser);

        return new AuthResponse(token, userResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return mapper.toUserResponse(user);
    }
}
