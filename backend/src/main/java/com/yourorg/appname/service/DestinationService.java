package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.DestinationRequest;
import com.yourorg.appname.dto.response.DestinationResponse;
import java.util.List;

public interface DestinationService {
    List<DestinationResponse> getAllDestinations(String category, String search);
    List<DestinationResponse> getTrendingDestinations();
    DestinationResponse getDestinationById(Long id);
    DestinationResponse createDestination(DestinationRequest request);
    DestinationResponse updateDestination(Long id, DestinationRequest request);
    void deleteDestination(Long id);
}
