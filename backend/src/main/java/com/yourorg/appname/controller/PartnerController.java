package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.ConnectionRequestDto;
import com.yourorg.appname.dto.request.PartnerPostRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.ConnectionResponseDto;
import com.yourorg.appname.dto.response.PartnerPostResponse;
import com.yourorg.appname.service.PartnerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {

    private final PartnerService partnerService;

    public PartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PartnerPostResponse>>> getPartnerPosts(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String style
    ) {
        List<PartnerPostResponse> posts = partnerService.getPartnerPosts(destination, gender, style);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PartnerPostResponse>> getPartnerPostById(@PathVariable Long id) {
        PartnerPostResponse post = partnerService.getPartnerPostById(id);
        return ResponseEntity.ok(ApiResponse.success(post));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PartnerPostResponse>> createPartnerPost(
            Authentication authentication,
            @Valid @RequestBody PartnerPostRequest request
    ) {
        String email = authentication.getName();
        PartnerPostResponse created = partnerService.createPartnerPost(email, request);
        return new ResponseEntity<>(ApiResponse.success("Partner post created successfully", created), HttpStatus.CREATED);
    }

    @PostMapping("/connect")
    public ResponseEntity<ApiResponse<ConnectionResponseDto>> sendConnectionRequest(
            Authentication authentication,
            @Valid @RequestBody ConnectionRequestDto request
    ) {
        String email = authentication.getName();
        ConnectionResponseDto response = partnerService.sendConnectionRequest(email, request);
        return ResponseEntity.ok(ApiResponse.success("Connection request sent successfully", response));
    }

    @GetMapping("/{id}/connections")
    public ResponseEntity<ApiResponse<List<ConnectionResponseDto>>> getConnectionsForPost(@PathVariable Long id) {
        List<ConnectionResponseDto> connections = partnerService.getConnectionsForPost(id);
        return ResponseEntity.ok(ApiResponse.success(connections));
    }
}
