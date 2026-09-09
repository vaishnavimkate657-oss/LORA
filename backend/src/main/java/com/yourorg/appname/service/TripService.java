package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.ItineraryItemRequest;
import com.yourorg.appname.dto.request.TripExpenseRequest;
import com.yourorg.appname.dto.request.TripRequest;
import com.yourorg.appname.dto.response.ItineraryItemResponse;
import com.yourorg.appname.dto.response.TripExpenseResponse;
import com.yourorg.appname.dto.response.TripResponse;

import java.util.List;

public interface TripService {
    List<TripResponse> getAllTrips();
    List<TripResponse> getTripsByUser(String userEmail);
    TripResponse getTripById(Long id);
    TripResponse createTrip(String userEmail, TripRequest request);
    TripResponse updateTrip(Long id, TripRequest request);
    void deleteTrip(Long id);

    ItineraryItemResponse addItineraryItem(Long tripId, ItineraryItemRequest request);
    void deleteItineraryItem(Long itemId);

    TripExpenseResponse addTripExpense(Long tripId, TripExpenseRequest request);
    List<TripExpenseResponse> getTripExpenses(Long tripId);
}
