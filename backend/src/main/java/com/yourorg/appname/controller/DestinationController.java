package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.DestinationRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.DestinationResponse;
import com.yourorg.appname.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DestinationResponse>>> getAllDestinations(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        List<DestinationResponse> destinations = destinationService.getAllDestinations(category, search);
        return ResponseEntity.ok(ApiResponse.success(destinations));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<DestinationResponse>>> getTrendingDestinations() {
        List<DestinationResponse> destinations = destinationService.getTrendingDestinations();
        return ResponseEntity.ok(ApiResponse.success(destinations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DestinationResponse>> getDestinationById(@PathVariable Long id) {
        DestinationResponse destination = destinationService.getDestinationById(id);
        return ResponseEntity.ok(ApiResponse.success(destination));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DestinationResponse>> createDestination(@Valid @RequestBody DestinationRequest request) {
        DestinationResponse created = destinationService.createDestination(request);
        return new ResponseEntity<>(ApiResponse.success("Destination created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DestinationResponse>> updateDestination(
            @PathVariable Long id,
            @Valid @RequestBody DestinationRequest request
    ) {
        DestinationResponse updated = destinationService.updateDestination(id, request);
        return ResponseEntity.ok(ApiResponse.success("Destination updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok(ApiResponse.success("Destination deleted successfully", null));
    }
}
