package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.ConnectionRequestDto;
import com.yourorg.appname.dto.request.PartnerPostRequest;
import com.yourorg.appname.dto.response.ConnectionResponseDto;
import com.yourorg.appname.dto.response.PartnerPostResponse;
import com.yourorg.appname.entity.PartnerConnectionRequest;
import com.yourorg.appname.entity.PartnerPost;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.PartnerConnectionRequestRepository;
import com.yourorg.appname.repository.PartnerPostRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.PartnerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartnerServiceImpl implements PartnerService {

    private final PartnerPostRepository partnerPostRepository;
    private final PartnerConnectionRequestRepository connectionRequestRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    public PartnerServiceImpl(
            PartnerPostRepository partnerPostRepository,
            PartnerConnectionRequestRepository connectionRequestRepository,
            UserRepository userRepository,
            EntityDtoMapper mapper
    ) {
        this.partnerPostRepository = partnerPostRepository;
        this.connectionRequestRepository = connectionRequestRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PartnerPostResponse> getPartnerPosts(String destination, String gender, String style) {
        List<PartnerPost> posts;
        boolean hasFilter = (destination != null && !destination.isEmpty()) ||
                           (gender != null && !gender.isEmpty()) ||
                           (style != null && !style.isEmpty());

        if (hasFilter) {
            posts = partnerPostRepository.filterPartnerPosts(
                    (destination != null && !destination.isEmpty()) ? destination : null,
                    (gender != null && !gender.isEmpty()) ? gender : null,
                    (style != null && !style.isEmpty()) ? style : null
            );
        } else {
            posts = partnerPostRepository.findByStatusOrderByCreatedAtDesc("OPEN");
        }

        return posts.stream()
                .map(mapper::toPartnerPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerPostResponse getPartnerPostById(Long id) {
        PartnerPost post = partnerPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partner post not found with id: " + id));
        return mapper.toPartnerPostResponse(post);
    }

    @Override
    @Transactional
    public PartnerPostResponse createPartnerPost(String userEmail, PartnerPostRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        PartnerPost post = new PartnerPost();
        post.setUser(user);
        post.setDestination(request.getDestination());
        post.setTravelStyle(request.getTravelStyle());
        post.setMinBudget(request.getMinBudget());
        post.setMaxBudget(request.getMaxBudget());
        post.setDateRange(request.getDateRange());
        post.setNote(request.getNote());
        post.setPreferredGender(request.getPreferredGender() != null ? request.getPreferredGender() : "Any");
        post.setStatus("OPEN");

        PartnerPost saved = partnerPostRepository.save(post);
        return mapper.toPartnerPostResponse(saved);
    }

    @Override
    @Transactional
    public ConnectionResponseDto sendConnectionRequest(String userEmail, ConnectionRequestDto request) {
        User sender = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        PartnerPost post = partnerPostRepository.findById(request.getPartnerPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Partner post not found: " + request.getPartnerPostId()));

        PartnerConnectionRequest conn = new PartnerConnectionRequest();
        conn.setSender(sender);
        conn.setPartnerPost(post);
        conn.setMessage(request.getMessage());
        conn.setStatus("PENDING");

        PartnerConnectionRequest saved = connectionRequestRepository.save(conn);
        return mapper.toConnectionResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionResponseDto> getConnectionsForPost(Long postId) {
        return connectionRequestRepository.findByPartnerPostId(postId).stream()
                .map(mapper::toConnectionResponse)
                .collect(Collectors.toList());
    }
}
