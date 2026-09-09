package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.DestinationRequest;
import com.yourorg.appname.dto.response.DestinationResponse;
import com.yourorg.appname.entity.Destination;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.DestinationRepository;
import com.yourorg.appname.service.DestinationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepository destinationRepository;
    private final EntityDtoMapper mapper;

    public DestinationServiceImpl(DestinationRepository destinationRepository, EntityDtoMapper mapper) {
        this.destinationRepository = destinationRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DestinationResponse> getAllDestinations(String category, String search) {
        List<Destination> destinations;
        if (search != null && !search.trim().isEmpty()) {
            destinations = destinationRepository.searchDestinations(search.trim());
        } else if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            destinations = destinationRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            destinations = destinationRepository.findAll();
        }

        return destinations.stream()
                .map(mapper::toDestinationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DestinationResponse> getTrendingDestinations() {
        return destinationRepository.findByIsTrendingTrue().stream()
                .map(mapper::toDestinationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DestinationResponse getDestinationById(Long id) {
        Destination dest = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
        return mapper.toDestinationResponse(dest);
    }

    @Override
    @Transactional
    public DestinationResponse createDestination(DestinationRequest request) {
        Destination dest = new Destination();
        dest.setTitle(request.getTitle());
        dest.setLocationState(request.getLocationState());
        dest.setCountry(request.getCountry());
        dest.setCategory(request.getCategory());
        dest.setDescription(request.getDescription());
        dest.setStartingPrice(request.getStartingPrice());
        dest.setRating(request.getRating());
        dest.setReviewsCount(request.getReviewsCount());
        dest.setImageUrl(request.getImageUrl());
        dest.setIsTrending(request.getIsTrending() != null ? request.getIsTrending() : false);

        Destination saved = destinationRepository.save(dest);
        return mapper.toDestinationResponse(saved);
    }

    @Override
    @Transactional
    public DestinationResponse updateDestination(Long id, DestinationRequest request) {
        Destination dest = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));

        dest.setTitle(request.getTitle());
        dest.setLocationState(request.getLocationState());
        dest.setCountry(request.getCountry());
        dest.setCategory(request.getCategory());
        dest.setDescription(request.getDescription());
        dest.setStartingPrice(request.getStartingPrice());
        if (request.getRating() != null) dest.setRating(request.getRating());
        if (request.getReviewsCount() != null) dest.setReviewsCount(request.getReviewsCount());
        dest.setImageUrl(request.getImageUrl());
        if (request.getIsTrending() != null) dest.setIsTrending(request.getIsTrending());

        Destination updated = destinationRepository.save(dest);
        return mapper.toDestinationResponse(updated);
    }

    @Override
    @Transactional
    public void deleteDestination(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Destination not found with id: " + id);
        }
        destinationRepository.deleteById(id);
    }
}
