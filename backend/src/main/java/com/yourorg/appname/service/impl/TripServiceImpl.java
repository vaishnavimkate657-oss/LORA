package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.ItineraryItemRequest;
import com.yourorg.appname.dto.request.TripExpenseRequest;
import com.yourorg.appname.dto.request.TripRequest;
import com.yourorg.appname.dto.response.ItineraryItemResponse;
import com.yourorg.appname.dto.response.TripExpenseResponse;
import com.yourorg.appname.dto.response.TripResponse;
import com.yourorg.appname.entity.ItineraryItem;
import com.yourorg.appname.entity.Trip;
import com.yourorg.appname.entity.TripExpense;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityDtoMapper;
import com.yourorg.appname.repository.ItineraryItemRepository;
import com.yourorg.appname.repository.TripExpenseRepository;
import com.yourorg.appname.repository.TripRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.TripService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final ItineraryItemRepository itineraryItemRepository;
    private final TripExpenseRepository tripExpenseRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    public TripServiceImpl(
            TripRepository tripRepository,
            ItineraryItemRepository itineraryItemRepository,
            TripExpenseRepository tripExpenseRepository,
            UserRepository userRepository,
            EntityDtoMapper mapper
    ) {
        this.tripRepository = tripRepository;
        this.itineraryItemRepository = itineraryItemRepository;
        this.tripExpenseRepository = tripExpenseRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(mapper::toTripResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getTripsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return tripRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(mapper::toTripResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
        return mapper.toTripResponse(trip);
    }

    @Override
    @Transactional
    public TripResponse createTrip(String userEmail, TripRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Trip trip = new Trip();
        trip.setUser(user);
        trip.setTitle(request.getTitle());
        trip.setDestination(request.getDestination());
        trip.setDurationDays(request.getDurationDays());
        trip.setEstimatedCost(request.getEstimatedCost());
        trip.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());

        Trip savedTrip = tripRepository.save(trip);

        if (request.getItineraryItems() != null) {
            for (ItineraryItemRequest itemReq : request.getItineraryItems()) {
                ItineraryItem item = new ItineraryItem();
                item.setTrip(savedTrip);
                item.setDayNumber(itemReq.getDayNumber());
                item.setTitle(itemReq.getTitle());
                item.setDescription(itemReq.getDescription());
                item.setStatus(itemReq.getStatus() != null ? itemReq.getStatus() : "UPCOMING");
                item.setOrderIndex(itemReq.getOrderIndex() != null ? itemReq.getOrderIndex() : 0);
                itineraryItemRepository.save(item);
                savedTrip.getItineraryItems().add(item);
            }
        }

        if (request.getTripExpenses() != null) {
            for (TripExpenseRequest expReq : request.getTripExpenses()) {
                TripExpense exp = new TripExpense();
                exp.setTrip(savedTrip);
                exp.setCategory(expReq.getCategory());
                exp.setDescription(expReq.getDescription());
                exp.setAmount(expReq.getAmount());
                exp.setPercentage(expReq.getPercentage());
                tripExpenseRepository.save(exp);
                savedTrip.getTripExpenses().add(exp);
            }
        }

        return mapper.toTripResponse(savedTrip);
    }

    @Override
    @Transactional
    public TripResponse updateTrip(Long id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        trip.setTitle(request.getTitle());
        trip.setDestination(request.getDestination());
        trip.setDurationDays(request.getDurationDays());
        trip.setEstimatedCost(request.getEstimatedCost());
        if (request.getStatus() != null) trip.setStatus(request.getStatus());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());

        Trip saved = tripRepository.save(trip);
        return mapper.toTripResponse(saved);
    }

    @Override
    @Transactional
    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trip not found with id: " + id);
        }
        tripRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ItineraryItemResponse addItineraryItem(Long tripId, ItineraryItemRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        ItineraryItem item = new ItineraryItem();
        item.setTrip(trip);
        item.setDayNumber(request.getDayNumber());
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setStatus(request.getStatus() != null ? request.getStatus() : "UPCOMING");
        item.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);

        ItineraryItem saved = itineraryItemRepository.save(item);
        return mapper.toItineraryItemResponse(saved);
    }

    @Override
    @Transactional
    public void deleteItineraryItem(Long itemId) {
        if (!itineraryItemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException("Itinerary item not found with id: " + itemId);
        }
        itineraryItemRepository.deleteById(itemId);
    }

    @Override
    @Transactional
    public TripExpenseResponse addTripExpense(Long tripId, TripExpenseRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        TripExpense exp = new TripExpense();
        exp.setTrip(trip);
        exp.setCategory(request.getCategory());
        exp.setDescription(request.getDescription());
        exp.setAmount(request.getAmount());
        exp.setPercentage(request.getPercentage());

        TripExpense saved = tripExpenseRepository.save(exp);
        return mapper.toTripExpenseResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripExpenseResponse> getTripExpenses(Long tripId) {
        return tripExpenseRepository.findByTripId(tripId).stream()
                .map(mapper::toTripExpenseResponse)
                .collect(Collectors.toList());
    }
}
