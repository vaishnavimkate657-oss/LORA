package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.ConnectionRequestDto;
import com.yourorg.appname.dto.request.PartnerPostRequest;
import com.yourorg.appname.dto.response.ConnectionResponseDto;
import com.yourorg.appname.dto.response.PartnerPostResponse;
import java.util.List;

public interface PartnerService {
    List<PartnerPostResponse> getPartnerPosts(String destination, String gender, String style);
    PartnerPostResponse getPartnerPostById(Long id);
    PartnerPostResponse createPartnerPost(String userEmail, PartnerPostRequest request);
    ConnectionResponseDto sendConnectionRequest(String userEmail, ConnectionRequestDto request);
    List<ConnectionResponseDto> getConnectionsForPost(Long postId);
}
